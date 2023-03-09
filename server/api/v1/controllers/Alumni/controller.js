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
import { AluminiServices } from "../../services/Alumini.js";
const { findAlumini, UpdateAlumini, createAlumini ,findList} = AluminiServices;
import queryHandler from '../../../../helper/query';


export class AluminiController {


  /**
   * @swagger
   * /alumini/listAlumini:
   *   get:
   *     tags:
   *       - ALUMINI
   *     description: addAlumini
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Alumini created successfully
   *       501:
   *         description: Something went wrong.
   *       500:
   *         description: Internal server error.
   */

   async listAlumini(req, res, next) {
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



  /**
   * @swagger
   * /alumini/addAlumini:
   *   post:
   *     tags:
   *       - ALUMINI
   *     description: addAlumini
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
   *       - name: Description
   *         description: Description
   *         in: formData
   *         required: true
   *       - name: Image
   *         description: Image
   *         in: formData
   *         type: file
   *         required: false
   *     responses:
   *       200:
   *         description: Alumini created successfully
   *       501:
   *         description: Something went wrong.
   *       500:
   *         description: Internal server error.
   */

  async addAlumini(req, res, next) {
    try {
      var validatedBody = await Joi.validate(req.body);
      const { Name, Description } = validatedBody;
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
        const result = await createAlumini(validatedBody);
        return res.json(new response(responseMessage.ALUMINI_CREATED, result));
      }
      const result = await createAlumini(validatedBody);
      return res.json(new response(responseMessage.ALUMINI_CREATED, result));
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  /**
   * @swagger
   * /alumini/editAlumini:
   *   put:
   *     tags:
   *       - ALUMINI
   *     description: editAlumini
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: AluminiID
   *         description: AluminiID
   *         in: formData
   *         required: true
   *       - name: Name
   *         description: Name
   *         in: formData
   *         required: true
   *       - name: Description
   *         description: Description
   *         in: formData
   *         required: true
   *       - name: Image
   *         description: Image
   *         in: formData
   *         type: file
   *         required: false
   *     responses:
   *       200:
   *         description: Alimini Updated successfully
   *       501:
   *         description: Something went wrong.
   *       500:
   *         description: Internal server error.
   */

  async editAlumini(req, res, next) {
    try {
      var validatedBody = await Joi.validate(req.body);
      const { Name, Description, AluminiID } = validatedBody;
      console.log({ validatedBody });
      let userResult = await findUser(
        { _id: req.userId },
        { userType: userType.ADMIN }
      );
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      const forumResult = await findAlumini({ _id: validatedBody.AluminiID });
      if (!forumResult) {
        throw apiError.notFound(responseMessage.ALUMINI_NOT_FOUND);
      }
      const result = await UpdateAlumini(
        { _id: forumResult._id },
        {
          $set: {
            Name: Name,
            Description: Description,
          },
        }
      );
      return res.json(new response(responseMessage.ALUMINI_UPDATED, result));
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
  
  /**
   * @swagger
   * /alumini/viewAlumini:
   *   post:
   *     tags:
   *       - ALUMINI
   *     description: viewAlumini
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: AluminiID
   *         description: AluminiID
   *         in: formData
   *         required: true
   *     responses:
   *       200:
   *         description: Webinar View successfully
   *       501:
   *         description: Something went wrong.
   *       500:
   *         description: Internal server error.
   *
   */
  async viewAlumini(req, res, next) {
    try {
      var validatedBody = await Joi.validate(req.body);
      const { MentorID } = validatedBody;
      var checkWebinarExits = await findAlumini({
        _id: validatedBody.AluminiID,
      });
      if (!checkWebinarExits) {
        throw apiError.notFound(responseMessage.ALUMINI_NOT_FOUND);
      }
      return res.json(
        new response(responseMessage.ALUMINI_FOUND, checkWebinarExits)
      );
    } catch (error) {
      return next(error);
    }
  }
}

export default new AluminiController();
