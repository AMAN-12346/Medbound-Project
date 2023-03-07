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
import { WebinarServices } from "../../services/Webinar";
const { createWebinar, UpdateWebinar, findWebibar } = WebinarServices;

export class WebinarController {
  /**
   * @swagger
   * /webinar/addWebinar:
   *   post:
   *     tags:
   *       - Webinar
   *     description: addFroum
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: Title
   *         description: Title
   *         in: formData
   *         required: true
   *       - name: Date_Time
   *         description: Date_Time
   *         in: formData
   *         required: true
   *       - name: Program
   *         description: Program
   *         in: formData
   *         required: true
   *       - name: Topic
   *         description: Topic
   *         in: formData
   *         required: true
   *       - name: Description
   *         description: Description
   *         in: formData
   *         required: true
   *       - name: Invite_Link
   *         description: Invite_Link
   *         in: formData
   *         required: true
   *       - name: Speaker_Image
   *         description: Speaker_Image
   *         in: formData
   *         type: file
   *         required: false
   *       - name: Webinar_Image
   *         description: Webinar_Image
   *         in: formData
   *         type: file
   *         required: false
   *     responses:
   *       200:
   *         description: Webinar created successfully.
   *       501:
   *         description: Something went wrong.
   *       500:
   *         description: Internal server error.
   */
  async addWebinar(req, res, next) {
    try {
      var validatedBody = await Joi.validate(req.body);
      const { Title, Date_Time, Program, Topic, Invite_Link, Description } = validatedBody;
      console.log(validatedBody);
      let userResult = await findUser(
        { _id: req.userId },
        { userType: userType.ADMIN }
      );
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      if (req.files) {
        req.body.Webinar_Image = await commonFunction.getImageUrlUpdated(req.files[0].path);
        validatedBody.Webinar_Image = req.files[0].path;
        req.body.Speaker_Image = await commonFunction.getImageUrlUpdated(req.files[0].path);
        validatedBody.Speaker_Image = req.files[0].path;
        const result = await createWebinar(validatedBody);
        return res.json(new response(responseMessage.FORUM_CREATED, result));
      }
      const result = await createWebinar(validatedBody);
      return res.json(new response(responseMessage.FORUM_CREATED, result));
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  /**
   * @swagger
   * /webinar/editWebinar:
   *   put:
   *     tags:
   *       - Webinar
   *     description: editFroum
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: token
   *         in: header
   *         required: true
   *       - name: WebinarId
   *         description: WebinarId
   *         in: formData
   *         required: true
   *       - name: Title
   *         description: Title
   *         in: formData
   *         required: true
   *       - name: Date_Time
   *         description: Date_Time
   *         in: formData
   *         required: true
   *       - name: Program
   *         description: Program
   *         in: formData
   *         required: true
   *       - name: Topic
   *         description: Topic
   *         in: formData
   *         required: true
   *       - name: Description
   *         description: Description
   *         in: formData
   *         required: true
   *       - name: Invite_Link
   *         description: Invite_Link
   *         in: formData
   *         required: true
   *       - name: Speaker_Image
   *         description: Speaker_Image
   *         in: formData
   *         type: file
   *         required: false
   *       - name: Webinar_Image
   *         description: Webinar_Image
   *         in: formData
   *         type: file
   *         required: false
   *     responses:
   *       200:
   *         description: Webinar created successfully
   *       501:
   *         description: Something went wrong.
   *       500:
   *         description: Internal server error.
   */
  async editWebinar(req, res, next) {
    try {
      var validatedBody = await Joi.validate(req.body);
      const { Title, Date_Time, Program, Topic, Invite_Link, Description } =
        validatedBody;
      console.log({ validatedBody });
      let userResult = await findUser(
        { _id: req.userId },
        { userType: userType.ADMIN }
      );
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      const forumResult = await findWebibar({ _id: validatedBody.WebinarId });
      if (!forumResult) {
        throw apiError.notFound(responseMessage.FORUM_NOT_FOUND);
      }
      const result = await UpdateWebinar(
        { _id: forumResult._id },
        {
          $set: {
            Title: Title,
            Date_Time: Date_Time,
            Topic: Topic,
            Invite_Link: Invite_Link,
            Description: Description,
          },
        }
      );
      return res.json(new response(responseMessage.FORUM_UPDATED, result));
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
  /**
   * @swagger
   * /webinar/viewWebinar:
   *   post:
   *     tags:
   *       - Webinar
   *     description: viewWebinar
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: WebinarID
   *         description: WebinarID
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
  async viewWebinar(req, res, next) {
    try {
      var validatedBody = await Joi.validate(req.body);
      const {_id  } = validatedBody;
      var checkWebinarExits = await findWebibar({ _id: validatedBody.WebinarID });
      if (!checkWebinarExits) {
        throw apiError.notFound(responseMessage.FORUM_CREATED);
      }
      return res.json(
        new response(responseMessage.WEBIBAR_DETAILS, checkWebinarExits)
      );
    } catch (error) {
      return next(error);
    }
  }
}

export default new WebinarController();
