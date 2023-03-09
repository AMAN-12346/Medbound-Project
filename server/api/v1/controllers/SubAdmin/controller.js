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
const secret = speakeasy.generateSecret({ length: 10 });
import { subAdminService } from '../../services/subAdminService';
const { create, find, findList, findandUpdate } = subAdminService;


export class subAdminController {


    /**
 * @swagger
 * /subAdmin/addSubAdmin:
 *   post:
 *     tags:
 *       - SubAdmin
 *     description: SubAdmin
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: subAdmin
 *         description: subAdmin
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/subAdmin'
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
    async addSubAdmin(req, res, next) {
        const validationSchema = {
            name: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            permission: Joi.object().optional()

        };
        try {
            const validatedBody = await Joi.validate(req.body, validationSchema);
            let query = { email: req.body.email, status: { $ne: status.DELETE } }
            let data = await find(query)
            if (data) {
                throw apiError.conflict(responseMessage.ALREADY_EXITS);

            }
            else {

                let result = await create(validatedBody)

                return res.json(new response(result, responseMessage.ADD_SUCCESS));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }



    /**
     * @swagger
     * /subAdmin/subAdminList:
     *   get:
     *     tags:
     *       - SubAdmin
     *     description: SubAdmin
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: token
     *         description: token
     *         in: header
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
    async subAdminList(req, res, next) {

        try {

            let query = { status: { $ne: status.DELETE } }
            var list = await findList(query);
            if (!list) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {

                return res.json(new response(list, responseMessage.DATA_FOUND));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }


    /**
 * @swagger
 * /subAdmin/viewSubAdmin:
 *   get:
 *     tags:
 *       - SubAdmin
 *     description: SubAdmin
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
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
    async viewSubAdmin(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };
        try {
            const validatedBody = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: status.DELETE } }
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



    /**
 * @swagger
 * /subAdmin/editSubAdmin:
 *   put:
 *     tags:
 *       - SubAdmin
 *     description: SubAdmin
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: _id
 *         description: _id
 *         in: query
 *         required: true
 *       - name: subAdmin
 *         description: subAdmin
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/subAdmin'
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
    async editSubAdmin(req, res, next) {
        const validationSchema = {
            name: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            permission: Joi.object().optional()

        };
        try {
            let currentEmail = req.body.email
            const validatedBody = await Joi.validate(req.body, validationSchema);
            let query = { _id: req.query._id, status: { $ne: status.DELETE } }
            let data = await find(query)
            let findEmail = await find({ email: currentEmail })
            if (data && findEmail && data.email != currentEmail) {

                throw apiError.conflict(responseMessage.ALREADY_EXITS);

            }
            else {

                let result = await findandUpdate({ _id: req.query._id }, validatedBody)

                return res.json(new response(result, responseMessage.UPDATE_SUCCESS));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }



    /**
 * @swagger
 * /subAdmin/deleteSubAdmin:
 *   delete:
 *     tags:
 *       - SubAdmin
 *     description: SubAdmin
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
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
    async deleteSubAdmin(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required(),


        };
        try {
            const validatedBody = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: status.DELETE } }
            let data = await find(query)
            if (!data) {
                throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
            }
            else {
                let result = await findandUpdate({ _id: req.query._id }, { status: status.DELETE })
                return res.json(new response(result, responseMessage.DELETE_SUCCESS));
            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }


    /**
* @swagger
* /subAdmin/blockUnblockSubAdmin:
*   put:
*     tags:
*       - SubAdmin
*     description: SubAdmin
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token
*         in: header
*         required: true
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
    async blockUnblockSubAdmin(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required(),


        };
        try {
            const validatedBody = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: status.DELETE } }
            let data = await find(query)
            if (!data) {
                throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
            }
            else {
                let changeStatus = data.status == status.ACTIVE ? status.BLOCK : status.ACTIVE
                let result = await findandUpdate({ _id: req.query._id }, { status: changeStatus})
                return res.json(new response(result, `Admin ${changeStatus.toLocaleLowerCase()} successfully`));
            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }

}

export default new subAdminController()