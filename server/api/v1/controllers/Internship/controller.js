
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
import queryHandler from '../../../../helper/query';
import { Internshipservive } from "../../services/Internship";
const { createinternship, Updateinternship, findinternship ,findList} = Internshipservive;

export class internshipController {
  /**
   * @swagger
   * /internship/addinternship:
   *   post:
   *     tags:
   *       - INTERNSHIP
   *     description: addinternship
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: name
   *         description: name
   *         in: formData
   *         required: true
   *       - name: description
   *         description: description
   *         in: formData
   *         required: false
   *       - name: link
   *         description: link
   *         in: formData
   *         required: false
   *       - name: image
   *         description: image
   *         in: formData
   *         type: file
   *         required: false
   *     responses:
   *       200:
   *         description: internship created successfully
   *       501:
   *         description: Something went wrong.
   *       500:
   *         description: Internal server error.
   */

  async addinternship(req, res, next) {
    try {
      var validatedBody = await Joi.validate(req.body);
      const { name, description, Image, link, } = validatedBody;
      console.log(validatedBody);
      let userResult = await findUser(
        { _id: req.userId },
        { userType: userType.ADMIN }
      );
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      if (req.files) {
        const ResData = await commonFunction.getImageUrlUpdated(req.files[0].path);
        validatedBody.Image = ResData;
        const result = await createinternship(validatedBody);
        return res.json(new response(responseMessage.INTERNSHIP_CREATED, result));
      }
      const result = await createinternship(validatedBody);
      return res.json(new response(responseMessage.INTERNSHIP_CREATED, result));
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  /**
    * @swagger
    * /internship/editinternship:
    *   put:
    *     tags:
    *       - INTERNSHIP
    *     description: editinternship
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: token
    *         description: token
    *         in: header
    *         required: true
    *       - name: InternshipId
    *         description: InternshipId
    *         in: formData
    *         required: true
    *       - name: name
    *         description: name
    *         in: formData
    *         required: true
    *       - name: description
    *         description: description
    *         in: formData
    *         required: true
    *       - name: Image
    *         description: Image
    *         in: formData
    *         type: file
    *         required: false
    *     responses:
    *       200:
    *         description: internship Updated successfully
    *       501:
    *         description: Something went wrong.
    *       500:
    *         description: Internal server error.
    */
  async editinternship(req, res, next) {
    try {
      var validatedBody = await Joi.validate(req.body);
      const { name, description, link, InternshipId } = validatedBody;
      // console.log({ validatedBody }); 
      let userResult = await findUser(
        { _id: req.userId },
        { userType: userType.ADMIN }
      );
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      const Result = await findinternship({ _id: validatedBody.InternshipId });
      if (!Result) {
        throw apiError.notFound(responseMessage.INTERSHIP_NOT_FOUND);
      }
      if (req.files) {
        const ResData = await commonFunction.getImageUrlUpdated(
          req.files[0].path
        );
        validatedBody.Image = ResData;
        const res1 = await Updateinternship(
          { _id: Result._id },
          {
            $set: {
              name: name,
              Image: ResData,
              description: description,
              link: link
            },
          }
        );
        return res.json(new response(responseMessage.INTERNSHIP_UPDATED, res1));
      }
      const res2 = await Updateinternship(
        { _id: Result._id },
        {
          $set: {
            name: name,
            description: description,
            link: link
          },
        }
      );
      return res.json(new response(responseMessage.INTERNSHIP_UPDATED, res2));
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  /**
   * @swagger
   * /internship/viewinternship:
   *   post:
   *     tags:
   *       - INTERNSHIP
   *     description: viewinternship
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: internshipId
   *         description: internshipId
   *         in: formData
   *         required: true
   *     responses:
   *       200:
   *         description: Internship View successfully
   *       501:
   *         description: Something went wrong.
   *       500:
   *         description: Internal server error.
   *
   */
  async viewinternship(req, res, next) {
    try {
      var validatedBody = await Joi.validate(req.body);
      const { internshipId } = validatedBody;
      var checkInternshipExits = await findinternship({
        _id: validatedBody.internshipId,
      });
      if (!checkInternshipExits) {
        throw apiError.notFound(responseMessage.INTERSHIP_NOT_FOUND);
      }
      return res.json(
        new response(responseMessage.INTERNSHIP_CREATED, checkInternshipExits)
      );
    } catch (error) {
      return next(error);
    }
  }




  /**
   * @swagger
   * /internship/listInternship:
   *   get:
   *     tags:
   *       - INTERNSHIP
   *     description: viewinternship
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Internship View successfully
   *       501:
   *         description: Something went wrong.
   *       500:
   *         description: Internal server error.
   *
   */
  async listInternship(req, res, next) {
   
    try {
        let query = {status: { $ne: 'DELETE' } }
        let appen =  await queryHandler.queryWithoutPagination(req.query)

        let finalQuery = {
            ...query,
            ...appen
        }
        let data = await findList(finalQuery)
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
}

export default new internshipController();

