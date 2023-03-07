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
import { mentorServices } from "../../services/mentorServices";
const { createMentor, UpdateMentor, findMentor} = mentorServices;

export class MentorController {
  /**
   * @swagger
   * /mentor/addMentor:
   *   post:
   *     tags:
   *       - MENTOR
   *     description: addMentor
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
   *       - name: Desgination
   *         description: Desgination
   *         in: formData
   *         required: true
   *       - name: Facebook
   *         description: Facebook
   *         in: formData
   *         required: false
   *       - name: Instagram
   *         description: Instagram
   *         in: formData
   *         required: false
   *       - name: LinkedIn
   *         description: LinkedIn
   *         in: formData
   *         required: false
   *       - name: Twitter
   *         description: Twitter
   *         in: formData
   *         required: false
   *       - name: Image
   *         description: Image
   *         in: formData
   *         type: file
   *         required: false
   *     responses:
   *       200:
   *         description: Forum created successfully
   *       501:
   *         description: Something went wrong.
   *       500:
   *         description: Internal server error.
   */

  async addMentor(req, res, next) {
    try {
      var validatedBody = await Joi.validate(req.body);
      const { Name, Desgination, Facebook, Instagram, LinkedIn, Twitter } = validatedBody;
      console.log(validatedBody);
      let userResult = await findUser(
        { _id: req.userId },
        { userType: userType.ADMIN }
      );
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      if (req.files) {
        req.body.Image = await commonFunction.getImageUrlUpdated(req.files[0].path);
        validatedBody.Image = req.files[0].path;
        const result = await createMentor(validatedBody);
        return res.json(new response(responseMessage.MENTOR_CREATED, result));
      }
      const result = await createMentor(validatedBody);
      return res.json(new response(responseMessage.FORUM_CREATED, result));
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  /**
 * @swagger
 * /mentor/editMentor:
 *   put:
 *     tags:
 *       - MENTOR
 *     description: editMentor
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: MentorID
 *         description: MentorID
 *         in: formData
 *         required: true
 *       - name: Name
 *         description: Name
 *         in: formData
 *         required: true
 *       - name: Desgination
 *         description: Desgination
 *         in: formData
 *         required: true
 *       - name: Facebook
 *         description: Facebook
 *         in: formData
 *         required: false
 *       - name: Instagram
 *         description: Instagram
 *         in: formData
 *         required: false
 *       - name: LinkedIn
 *         description: LinkedIn
 *         in: formData
 *         required: false
 *       - name: Twitter
 *         description: Twitter
 *         in: formData
 *         required: false
 *       - name: Image
 *         description: Image
 *         in: formData
 *         type: file
 *         required: false
 *     responses:
 *       200:
 *         description: Forum created successfully
 *       501:
 *         description: Something went wrong.
 *       500:
 *         description: Internal server error.
 */

  async editMentor(req, res, next) {
    try {
      var validatedBody = await Joi.validate(req.body);
      const {Name,  Desgination, Facebook, Instagram, LinkedIn, Twitter, MentorID } =
        validatedBody;
      console.log({ validatedBody });
      let userResult = await findUser(
        { _id: req.userId },
        { userType: userType.ADMIN }
      );
      if (!userResult) {
        throw apiError.notFound(responseMessage.USER_NOT_FOUND);
      }
      const forumResult = await findMentor({ _id: validatedBody.MentorID });
      if (!forumResult) {
        throw apiError.notFound(responseMessage.MENTOR_NOT_FOUND);
      }
      const result = await UpdateMentor(
        { _id: forumResult._id },
        {
          $set: {
            Name: Name,
            Desgination: Desgination,
            Facebook: Facebook,
            Instagram: Instagram,
            LinkedIn: LinkedIn,
            Twitter: Twitter,
          },
        }
      );
      return res.json(new response(responseMessage.MENTOR_UPDATED, result));
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
  /**
   * @swagger
   * /mentor/viewMentor:
   *   get:
   *     tags:
   *       - MENTOR
   *     description: viewMentor
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: MentorID
   *         description: MentorID
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
  async viewMentor(req, res, next) {
    try {
      var validatedBody = await Joi.validate(req.body);
      const { MentorID } = validatedBody;
      var checkWebinarExits = await findMentor({
        _id: validatedBody.MentorID,
      });
      if (!checkWebinarExits) {
        throw apiError.notFound(responseMessage.MENTOR_NOT_FOUND);
      }
      return res.json(
        new response(responseMessage.MENTOR_CREATED, checkWebinarExits)
      );
    } catch (error) {
      return next(error);
    }
  }
}

export default new MentorController();
