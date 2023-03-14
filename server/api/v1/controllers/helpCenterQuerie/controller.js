import Joi from "joi";
import Mongoose from "mongoose";
import _ from "lodash";
import config from "config";
import apiError from '../../../../helper/apiError';
import response from '../../../../../assets/response';
import bcrypt from 'bcryptjs';
import responseMessage from '../../../../../assets/responseMessage';
import commonFunction from '../../../../helper/util';
import jwt from 'jsonwebtoken';
import status from '../../../../enums/status';
import speakeasy from 'speakeasy';
import userType from "../../../../enums/userType";
import queryHandler from '../../../../helper/query';
const secret = speakeasy.generateSecret({ length: 10 });
import { helpCenterQueryService } from '../../services/helpCenterQueriesService';
const { create, find, findList, findandUpdate } = helpCenterQueryService;


export class helpCenterQueryController {


    /**
     * @swagger
     * /helpCenterQuery/addhelpCenterQuery:
     *   post:
     *     tags:
     *       - HelpCenter
     *     description: HelpCenter
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: firstName
     *         description: firstName
     *         in: formData
     *         required: true
     *       - name: lastName
     *         description: lastName
     *         in: formData
     *         required: false
     *       - name: email
     *         description: email
     *         in: formData
     *         required: true
     *       - name: phoneNumber
     *         description: phoneNumber
     *         in: formData
     *         required: false
     *       - name: description
     *         description: description
     *         in: formData
     *         required: true
     *     responses:
     *       200:
     *         description: User created successfully
     *       409:
     *         description: This email already exists ./ This mobile number already exists.
     *       400:
     *         description:  Password and confirm password does not match
     *       501:
     *         description: Something went wrong.
     *       500:
     *         description: Internal server error.
     */
    async addhelpCenterQuery(req, res, next) {
        const validationSchema = {
            firstName: Joi.string().required(),
            lastName: Joi.string().optional(),
            email: Joi.string().required(),
            phoneNumber: Joi.string().optional(),
            description: Joi.string().required()
        };
        try {
            const validatedBody = await Joi.validate(req.body, validationSchema);
            var result = await create(validatedBody)
            return res.json(new response(result, responseMessage.ADD_SUCCESS));

        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }




    /**
 * @swagger
 * /helpCenterQuery/listHelpCenterQuery:
 *   get:
 *     tags:
 *       - HelpCenter
 *     description: HelpCenter
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User created successfully
 *       409:
 *         description: This email already exists ./ This mobile number already exists.
 *       400:
 *         description:  Password and confirm password does not match
 *       501:
 *         description: Something went wrong.
 *       500:
 *         description: Internal server error.
 */
    async listHelpCenterQuery(req, res, next) {

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
 * /helpCenterQuery/viewHelpCenterQuery:
 *   get:
 *     tags:
 *       - HelpCenter
 *     description: HelpCenter
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: _id
 *         in: query
 *         required: true
 *     responses:
 *       200:
 *         description: User created successfully
 *       409:
 *         description: This email already exists ./ This mobile number already exists.
 *       400:
 *         description:  Password and confirm password does not match
 *       501:
 *         description: Something went wrong.
 *       500:
 *         description: Internal server error.
 */
    async viewHelpCenterQuery(req, res, next) {

        try {
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            let data = await find(query)
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

export default new helpCenterQueryController()