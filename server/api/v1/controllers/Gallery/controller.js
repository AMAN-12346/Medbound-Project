import Joi from "joi";
import Mongoose from "mongoose";
import _ from "lodash";
import config from "config";
import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import bcrypt from "bcryptjs";
import responseMessage from "../../../../../assets/responseMessage";
import commonFunction from "../../../../helper/util";
import jwt from "jsonwebtoken";
import status from "../../../../enums/status";
import speakeasy from "speakeasy";
import userType from "../../../../enums/userType";
import queryHandler from '../../../../helper/query';
const secret = speakeasy.generateSecret({ length: 10 });
import { userServices } from "../../services/user";

const { findUser } = userServices;
import { GalleryServices } from "../../services/GellaryServices";
const { createGellary, findGallery, UpdateGallery,findGalleryList } = GalleryServices;

export class GalleryController {

  /**
     * @swagger
     * /gallery/listGallery:
     *   get:
     *     tags:
     *       - GALLERY
     *     description: addGallery
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Returns success message
     */
  async listGallery(req, res, next) {
    try {
      let query = { status: { $ne: 'DELETE' } }
      let appen = await queryHandler.queryWithoutPagination(req.query)

      let finalQuery = {
        ...query,
        ...appen
      }
      let data = await findGalleryList(finalQuery)
      if (!data) {
        throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
      }
      else {
        return res.json(new response(data, responseMessage.DATA_FOUND));
      }
    } catch (error) {
      console.log("error ==========> 79", error)
      return next(error);
    }
  }


  /**
   * @swagger
   * /gallery/addGallery:
   *   post:
   *     tags:
   *       - GALLERY
   *     description: addGallery
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Name
   *         description: Name
   *         in: formData
   *         required: true
   *       - name: image
   *         description: get Multiple Image Url
   *         in: formData
   *         type: file
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async addGallery(req, res, next) {
    try {
      var validatedBody = await Joi.validate(req.body);
      const { Name } = validatedBody;
      console.log(validatedBody);
      if (req.files) {
        var finalresult = [];
        for (let i = 0; i < req.files.length; i++) {
          var result = await commonFunction.getImageMultipleUrl(
            req.files[i].path
          );
          finalresult.push(result);
        }
        validatedBody.Image = finalresult;
        const res1 = await createGellary(validatedBody);
        return res.json(new response(responseMessage.GALLERY_CREATED, res1));
      }
      const res2 = await createGellary(validatedBody);
      return res.json(new response(responseMessage.GALLERY_CREATED, res2));
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  /**
   * @swagger
   * /gallery/viewGallery:
   *   post:
   *     tags:
   *       - GALLERY
   *     description: viewGallery
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: GalleryID
   *         description: GalleryID
   *         in: formData
   *         required: true
   *     responses:
   *       200:
   *         description: Gallery View successfully
   *       501:
   *         description: Something went wrong.
   *       500:
   *         description: Internal server error.
   *
   */
  async viewGallery(req, res, next) {
    try {
      var validatedBody = await Joi.validate(req.body);
      const { GalleryID } = validatedBody;
      var checkGalleryExits = await findGallery({
        _id: validatedBody.GalleryID,
      });
      if (!checkGalleryExits) {
        throw apiError.notFound(responseMessage.GELLARY_NOT_FOUND);
      }
      return res.json(
        new response(responseMessage.GELLARY_NOT_FOUND, checkGalleryExits)
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /gallery/editGallery:
   *   put:
   *     tags:
   *       - GALLERY
   *     description: editGallery
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: GalleryID
   *         description: GalleryID
   *         in: formData
   *         required: true
   *       - name: Name
   *         description: Name
   *         in: formData
   *         required: true
   *       - name: Image
   *         description:  multipull Image
   *         in: formData
   *         type: file
   *         required: false
   *     responses:
   *       200:
   *         description: Gallery Updated successfully
   *       501:
   *         description: Something went wrong.
   *       500:
   *         description: Internal server error.
   */

  async editGallery(req, res, next) {
    try {
      var validatedBody = await Joi.validate(req.body);
      const { Name, GalleryID } = validatedBody;
      console.log({ validatedBody });
      let userResult = await findUser(
        { _id: req.userId },
        { userType: userType.ADMIN }
      );
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      const GalleryResult = await findGallery({ _id: validatedBody.GalleryID });
      if (!GalleryResult) {
        throw apiError.notFound(responseMessage.GELLARY_NOT_FOUND);
      }
      if (req.files) {
        var finalresult = [];
        for (let i = 0; i < req.files.length; i++) {
          var result = await commonFunction.getImageMultipleUrl(
            req.files[i].path
          );
          finalresult.push(result);
        }
        validatedBody.Image = finalresult;
        const resData = await UpdateGallery(
          { _id: GalleryResult._id },
          {
            $set: {
              Name: Name,
              Image: finalresult,
            },
          }
        );
        return res.json(new response(responseMessage.Gallery_UPDATED, resData));
      }
      const resData = await UpdateGallery(
        { _id: GalleryResult._id },
        {
          $set: {
            Name: Name,
          },
        }
      );
      return res.json(new response(responseMessage.Gallery_UPDATED, resData));
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
}

export default new GalleryController();
