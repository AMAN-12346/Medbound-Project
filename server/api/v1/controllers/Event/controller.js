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
import { eventservice } from "../../services/Event";
const { findevent,UpdatEevent,  createWebinar } = eventservice;

export class eventController {
    /**
     * @swagger
     * /event/addevent:
     *   post:
     *     tags:
     *       - EVENT
     *     description: addevent
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: token
     *         description: token
     *         in: header
     *         required: true
     *       - name: title
     *         description: title
     *         in: formData
     *         required: true
     *       - name: date
     *         description: date
     *         in: formData
     *         required: true
     *       - name: invitelink
     *         description: invitelink
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
     *         description: Event created successfully.
     *       501:
     *         description: Something went wrong.
     *       500:
     *         description: Internal server error.
     */
    async addevent(req, res, next) {
        try {
            var validatedBody = await Joi.validate(req.body);
            const { title, date, Image, description, invitelink } = validatedBody;
            console.log(validatedBody);
            let userResult = await findUser(
                { _id: req.userId },
                { userType: userType.ADMIN }
            );
            if (!userResult) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }
            if (req.files) {
                const resData = await commonFunction.getImageUrlUpdated(
                    req.files[0].path
                );
                validatedBody.Image = resData;
                const result = await createWebinar(validatedBody);
                return res.json(new response(responseMessage.EVENT_CREATED, result));
            }
            const result = await createWebinar(validatedBody);
            return res.json(new response(responseMessage.EVENT_CREATED, result));
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }

    /**
     * @swagger
     * /event/editevent:
     *   put:
     *     tags:
     *       - EVENT
     *     description: editevent
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: token
     *         description: token
     *         in: header
     *         required: true
     *       - name: EventId
     *         description: EventId
     *         in: formData
     *         required: true
     *       - name: title
     *         description: name
     *         in: formData
     *         required: 
     *       - name: date
     *         description: date
     *         in: formData
     *         required: true
     *       - name: description
     *         description: description
     *         in: formData
     *         required: true
     *       - name: invitelink
     *         description: invitelink
     *         in: formData
     *         required: true
     *       - name: Image
     *         description: Image
     *         in: formData
     *         type: file
     *         required: false
     *     responses:
     *       200:
     *         description: Event Updated successfully
     *       501:
     *         description: Something went wrong.
     *       500:
     *         description: Internal server error.
     */

    async editevent(req, res, next) {
        try {
            var validatedBody = await Joi.validate(req.body);
            const { title, date, description, invitelink, EventId } = validatedBody;
            console.log({ validatedBody });
            let userResult = await findUser(
                { _id: req.userId },
                { userType: userType.ADMIN }
            );
            if (!userResult) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }
            const Result = await findevent({ _id: validatedBody.EventId });
            if (!Result) {
                throw apiError.notFound(responseMessage.EVENT_NOT_FOUND);
            }
            if (req.files) {
                const ResData = await commonFunction.getImageUrlUpdated(
                    req.files[0].path
                );
                validatedBody.Image = ResData
                const res1 = await UpdatEevent(
                    { _id: Result._id },
                    {
                        $set: {
                            title: title,
                            Image: ResData,
                            date: date,
                            description: description,
                            invitelink: invitelink
                        },
                    }
                );
                return res.json(new response(responseMessage.EVENT_UPDATE, res1));
            }
            const res2 = await Updateevent(
                { _id: Result._id },
                {
                    $set: {
                        title: title,
                        date: date,
                        description: description,
                        invitelink: invitelink
                    },
                }
            );
            return res.json(new response(responseMessage.EVENT_UPDATE, res2));
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }

    /**
     * @swagger
     * /event/viewevent:
     *   post:
     *     tags:
     *       - EVENT
     *     description: viewevent
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: EventId
     *         description: EventId
     *         in: formData
     *         required: true
     *     responses:
     *       200:
     *         description: Event View successfully
     *       501:
     *         description: Something went wrong.
     *       500:
     *         description: Internal server error.
     *
     */
    async viewevent(req, res, next) {
        try {
            var validatedBody = await Joi.validate(req.body);
            const { EventId } = validatedBody;
            var checkEventExits = await findevent({
                _id: validatedBody.EventId,
            });
            if (!checkEventExits) {
                throw apiError.notFound(responseMessage.EVENT_NOT_FOUND);
            }
            return res.json(
                new response(responseMessage.EVENT_NOT_FOUND, checkEventExits)
            );
        } catch (error) {
            return next(error);
        }
    }
}

export default new eventController();
