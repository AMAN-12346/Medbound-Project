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
const secret = speakeasy.generateSecret({ length: 10 });
import { userServices } from "../../services/user";
const { findUser } = userServices;
import { BannerServices } from "../../services/banner";
const { findBanner, UpdateBAnner, createBanner } = BannerServices;

export class bannerController {
  /**
   * @swagger
   * /banner/addBanner:
   *   post:
   *     tags:
   *       - BANNER
   *     description: addBanner
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: Name
   *         description: Name
   *         in: formData
   *         required: true
   *       - name: Image
   *         description: Image
   *         in: formData
   *         type: file
   *         required: false
   *     responses:
   *       200:
   *         description: Banner created successfully
   *       501:
   *         description: Something went wrong.
   *       500:
   *         description: Internal server error.
   */
  async addBanner(req, res, next) {
    try {
      var validatedBody = await Joi.validate(req.body);
      const { Name } = validatedBody;
      console.log(validatedBody);
      let userResult = await findUser(
        { _id: req.userId },
        { userType: userType.ADMIN }
      );
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      if (req.files) {
        req.body.Image = await commonFunction.getImageUrlUpdated(
          req.files[0].path
        );
        validatedBody.Image = req.files[0].path;
        const result = await createBanner(validatedBody);
        return res.json(new response(responseMessage.BANNER_CREATED, result));
      }
      const result = await createBanner(validatedBody);
      return res.json(new response(responseMessage.BANNER_CREATED, result));
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  /**
   * @swagger
   * /banner/editBanner:
   *   put:
   *     tags:
   *       - BANNER
   *     description: editBanner
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: BANNERID
   *         description: BANNERID
   *         in: formData
   *         required: true
   *       - name: Name
   *         description: Name
   *         in: formData
   *         required: true
   *       - name: Image
   *         description: Image
   *         in: formData
   *         type: file
   *         required: false
   *     responses:
   *       200:
   *         description: Banner Updated successfully
   *       501:
   *         description: Something went wrong.
   *       500:
   *         description: Internal server error.
   */

  async editBanner(req, res, next) {
    try {
      var validatedBody = await Joi.validate(req.body);
      const { Name, BANNERID } = validatedBody;
      console.log({ validatedBody });
      let userResult = await findUser(
        { _id: req.userId },
        { userType: userType.ADMIN }
      );
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      const BannerResult = await findBanner({ _id: validatedBody.BANNERID });
      if (!BannerResult) {
        throw apiError.notFound(responseMessage.BANNER_NOT_FOUND);
      }
      if (req.files) {
        req.body.Image = await commonFunction.getImageUrlUpdated(
          req.files[0].path
        );
        validatedBody.Image = req.files[0].path;

        const res1 = await UpdateBAnner(
          { _id: BannerResult._id },
          {
            $set: {
              Name: Name,
              Image: validatedBody.Image,
            },
          }
        );
        return res.json(new response(responseMessage.BANNER_UPDATED, res1));
      }
      const res1 = await UpdateBAnner(
        { _id: forumResult._id },
        {
          $set: {
            Name: Name
          },
        }
      );
      return res.json(new response(responseMessage.BANNER_UPDATED, res1));
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  /**
   * @swagger
   * /banner/viewBanner:
   *   post:
   *     tags:
   *       - BANNER
   *     description: viewBanner
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: BannerID
   *         description: BannerID
   *         in: formData
   *         required: true
   *     responses:
   *       200:
   *         description: Banner View successfully
   *       501:
   *         description: Something went wrong.
   *       500:
   *         description: Internal server error.
   *
   */
  async viewBanner(req, res, next) {
    try {
      var validatedBody = await Joi.validate(req.body);
      const { BannerID } = validatedBody;
      var checkBannerExits = await findBanner({
        _id: validatedBody.BannerID,
      });
      if (!checkBannerExits) {
        throw apiError.notFound(responseMessage.BANNER_NOT_FOUND);
      }
      return res.json(
        new response(responseMessage.BANNER_NOT_FOUND, checkBannerExits)
      );
    } catch (error) {
      return next(error);
    }
  }
}

export default new bannerController();
