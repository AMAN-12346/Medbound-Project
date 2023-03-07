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
const {
    userCheck,
    paginateSearch,
    insertManyUser,
    createAddress,
    checkUserExists,
    emailMobileExist,
    createUser,
    findUser,
    updateUser,
    updateUserById,
    checkSocialLogin,
} = userServices;
import { froumServices } from "../../services/ForumAndSocial_Clubs";
const { createForum, UpdateForum, findForum } = froumServices;

export class froumController {
    /**
     * @swagger
     * /forum/addFroum:
     *   post:
     *     tags:
     *       - Forum And Social_Clubs
     *     description: addFroum
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
     *         required: true
     *       - name: activities
     *         description: activities
     *         in: formData
     *         required: true
     *       - name: format
     *         description: format
     *         in: formData
     *         required: true
     *       - name: Photo
     *         description: Photo
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
    async addFroum(req, res, next) {
        const validationSchema = {
            name: Joi.string().required(),
            description: Joi.string().required(),
            activities: Joi.string().required(),
            format: Joi.string().required(),
        };
        try {
            var validatedBody = await Joi.validate(req.body, validationSchema);
            const { name, description, activities, format } = validatedBody;
            console.log("req.nhg", req.body);
            let userResult = await findUser(
                { _id: req.userId },
                { userType: userType.ADMIN }
            );
            if (!userResult) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }
            if (req.files) {
                req.files.photo = await commonFunction.getImageUrlUpdated(req.files.path);
                validatedBody.photo = req.files.path;
                const result = await createForum(req.body);
                return res.json(new response(responseMessage.FORUM_CREATED, result));
            }
            const result = await createForum(req.body);
            return res.json(new response(responseMessage.FORUM_CREATED, result));
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }

    /**
     * @swagger
     * /forum/editFroum:
     *   put:
     *     tags:
     *       - Forum And Social_Clubs
     *     description: editFroum
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
     *         required: true
     *       - name: activities
     *         description: activities
     *         in: formData
     *         required: true
     *       - name: format
     *         description: format
     *         in: formData
     *         required: true
     *       - name: Photo
     *         description: Photo
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
    async editFroum(req, res, next) {
        const validationSchema = {
            ForumId: Joi.string().required(),
            name: Joi.string().required(),
            description: Joi.string().required(),
            activities: Joi.string().required(),
            format: Joi.string().required(),
        };
        try {
            var validatedBody = await Joi.validate(req.body, validationSchema);
            const { name, description, activities, format } = validatedBody;
            console.log({ validatedBody });
            let userResult = await findUser(
                { _id: req.userId },
                { userType: userType.ADMIN }
            );
            if (!userResult) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }
            const forumResult = await findForum({ _id: validatedBody.ForumId });
            if (!forumResult) {
                throw apiError.notFound(responseMessage.FORUM_NOT_FOUND)
            }
            const result = await UpdateForum(
                { _id: forumResult._id },
                {
                    $set: {
                        name: name,
                        description: description,
                        activities: activities,
                        format: format,
                    },
                }
            );
            return res.json(new response(responseMessage.FORUM_UPDATED, result));
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }

}

export default new froumController();
