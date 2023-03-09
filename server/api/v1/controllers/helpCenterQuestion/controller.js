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
import { helpCenterQuestionService } from '../../services/helpCenterQuestionService';
import queryHandler from '../../../../helper/query';
const { create, find, findList, findandUpdate } = helpCenterQuestionService;


export class helpCenterQuestionController {


    /**
     * @swagger
     * /helpCenterQuestion/addHelpCenterQuestion:
     *   post:
     *     tags:
     *       - HelpCenter
     *     description: HelpCenter
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: token
     *         description: token
     *         in: header
     *         required: true
     *       - name: question
     *         description: question
     *         in: formData
     *         required: true
     *       - name: answer
     *         description: answer
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
    async addHelpCenterQuestion(req, res, next) {
        const validationSchema = {
            question: Joi.string().required(),
            answer: Joi.string().required()
        };
        try {
            const validatedBody = await Joi.validate(req.body, validationSchema);
            let query = { question: req.body.question, status: { $ne: 'DELETE' } }
            let data = await find(query)
            if (data) {
                throw apiError.conflict(responseMessage.ALREADY_EXITS);

            }
            else {
                var result = await create(validatedBody)
                return res.json(new response(result, responseMessage.ADD_SUCCESS));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }



    /**
     * @swagger
     * /helpCenterQuestion/editHelpCenterQuestion:
     *   put:
     *     tags:
     *       - HelpCenter
     *     description: HelpCenter
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
     *       - name: question
     *         description: question
     *         in: formData
     *         required: true
     *       - name: answer
     *         description: answer
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
    async editHelpCenterQuestion(req, res, next) {
        const validationSchema = {
            question: Joi.string().required(),
            answer: Joi.string().required()
        };
        try {
            const validatedBody = await Joi.validate(req.body, validationSchema);
            let currentQuestion = req.body.question
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            let data = await find(query)
            let findQuestion = await find({ question: req.body.question, status: { $ne: 'DELETE' } })
            if (data && findQuestion && data.question != currentQuestion) {
                throw apiError.conflict(responseMessage.ALREADY_EXITS);

            }
            else {
                var result = await findandUpdate({ _id: req.query._id }, validatedBody)
                return res.json(new response(result, responseMessage.ADD_SUCCESS));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }


    /**
 * @swagger
 * /helpCenterQuestion/deleteHelpCenterQuestion:
 *   delete:
 *     tags:
 *       - HelpCenter
 *     description: HelpCenter
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
    async deleteHelpCenterQuestion(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };
        try {
            const validatedBody = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            let data = await find(query)
            if (!data) {
                throw apiError.conflict(responseMessage.DATA_NOT_FOUND);

            }
            else {
                var result = await findandUpdate({ _id: req.query._id }, { status: status.DELETE })
                return res.json(new response(result, responseMessage.DELETE_SUCCESS));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }



    /**
* @swagger
* /helpCenterQuestion/blockUnblockHelpCenterQuestion:
*   put:
*     tags:
*       - HelpCenter
*     description: HelpCenter
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
    async blockUnblockHelpCenterQuestion(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };
        try {
            const validatedBody = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            let data = await find(query)
            if (!data) {
                throw apiError.conflict(responseMessage.DATA_NOT_FOUND);

            }
            else {
                let changedStatus = data.status == status.ACTIVE ? status.BLOCK : status.ACTIVE
                var result = await findandUpdate({ _id: req.query._id }, { status: changedStatus })
                return res.json(new response(result, responseMessage.UPDATE_SUCCESS));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }



    /**
* @swagger
* /helpCenterQuestion/viewHelpCenterQuestion:
*   get:
*     tags:
*       - HelpCenter
*     description: HelpCenter
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
async viewHelpCenterQuestion(req, res, next) {
    const validationSchema = {
        _id: Joi.string().required()
    };
    try {
        const validatedBody = await Joi.validate(req.query, validationSchema);
        let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
        let data = await find(query)
        if (!data) {
            throw apiError.conflict(responseMessage.DATA_NOT_FOUND);

        }
        else {
          
            return res.json(new response(data, responseMessage.UPDATE_SUCCESS));

        }
    } catch (error) {
        console.log("error ==========> 79", error)
        return next(error);
    }
}


   /**
* @swagger
* /helpCenterQuestion/listHelpCenterQuestion:
*   get:
*     tags:
*       - HelpCenter
*     description: HelpCenter
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
async listHelpCenterQuestion(req, res, next) {
   
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

export default new helpCenterQuestionController()