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
import queryHandler from '../../../../helper/query';
import { examModeleService } from '../../services/examModeleService';
const { create, find, findList, findandUpdateExam, CheckExamExits, CreateExam } = examModeleService;
import { userServices } from "../../services/user";
const { findUser, FindUser } = userServices;

export class ExamModuleController {

    /**
 * @swagger
 * /exam/listExamModule:
 *   get:
 *     tags:
 *       - Exam Module
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
    async listExamModule(req, res, next) {
        try {
            let userResult = await findUser({ _id: req.userId }, { userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] } });
            if (!userResult) { throw apiError.conflict(responseMessage.UNAUTHORIZED); }
            let query = { status: { $ne: 'DELETE' } }
            let appen = await queryHandler.queryWithoutPagination(req.query)
            let finalQuery = {
                ...query,
                ...appen
            }
            let data = await findList(finalQuery)
            if (!data) { throw apiError.conflict(responseMessage.DATA_NOT_FOUND); }
            return res.json(new response(data, responseMessage.DATA_FOUND));
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }

    /**
     * @swagger
     * /exam/AddExamModule:
     *   post:
     *     tags:
     *       - Exam Module
     *     description: AddExamModule
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
     *       - name: Link
     *         description: Exam Link
     *         in: formData
     *         required: true
     *       - name: Exam_Type
     *         description: Exam Type
     *         in: formData
     *         required: true
     *         enum: ["MedBound_Exam", "Institution_Exam"]
     *     responses:
     *       200:
     *         description: Event created successfully.
     *       501:
     *         description: Something went wrong.
     *       500:
     *         description: Internal server error.
     */
    async AddExamModule(req, res, next) {
        try {
            var validatedBody = await Joi.validate(req.body);
            const { Exam_Type, name, Link } = validatedBody;
            let userResult = await findUser(
                { _id: req.userId },
                { userType: { $in: [userType.ADMIN, userType.SUB_ADMIN] } }
            );
            if (!userResult) { throw apiError.conflict(responseMessage.UNAUTHORIZED); }
            const result = await CreateExam(validatedBody);
            return res.json(new response(responseMessage.EXAM_CREATED, result));
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }


    /**
     * @swagger
     * /exam/EditExamModule:
     *   put:
     *     tags:
     *       - Exam Module
     *     description: EditExamModule
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: token
     *         description: token
     *         in: header
     *         required: true
     *       - name: _id
     *         description: Exam Id
     *         in: query
     *         required: true
     *       - name: Exam_Type
     *         description: Exam Type
     *         in: formData
     *         required: true
     *         enum: ["MedBound_Exam", "Institution_Exam"]
     *       - name: name
     *         description: name
     *         in: formData
     *         required: true
     *       - name: Link
     *         description: Exam Link
     *         in: formData
     *         required: true
     *     responses:
     *       200:
     *         description: Exam Updated successfully
     *       404:
     *         description: not Found
     *       501:
     *         description: Something went wrong.
     *       500:
     *         description: Internal server error.
     */
    async EditExamModule(req, res, next) {
        try {
            var validatedBody = await Joi.validate(req.body);
            const { Exam_Type, name, Link } = validatedBody;
            let userResult = await findUser({ _id: req.userId, userType: userType.ADMIN })
            if (!userResult) { throw apiError.conflict(responseMessage.UNAUTHORIZED); }
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            let Exam = await CheckExamExits(query)
            if (!Exam) { throw apiError.NOT_FOUND(responseMessage.NOT_FOUND) }
            var resData = await findandUpdateExam({ _id: Exam._id }, validatedBody);
            if (!resData) { throw apiError.conflict(responseMessage.NOT_FOUND); }
            return res.json(new response(resData, responseMessage.EXAM_UPDATED));
        } catch (error) {
            console.log(error)
            return next(error);
        }
    }



    /**
 * @swagger
 * /exam/BlockExamModeule:
 *   put:
 *     tags:
 *       - Exam Module
 *     description: BlockExamModeule
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: _id
 *         description: Exam Id
 *         in: query
 *         required: true
 *     responses:
 *       200:
 *         description: Exam Updated successfully
 *       404:
 *         description: not Found
 *       501:
 *         description: Something went wrong.
 *       500:
 *         description: Internal server error.
 */
    async BlockExamModeule(req, res, next) {
        try {
            let userResult = await findUser({ _id: req.userId, userType: userType.ADMIN })
            if (!userResult) { throw apiError.conflict(responseMessage.UNAUTHORIZED); }
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            let Exam = await CheckExamExits(query)
            if (!Exam) { throw apiError.NOT_FOUND(responseMessage.NOT_FOUND) }
            let changedStatus = Exam.status == status.ACTIVE ? status.BLOCK : status.ACTIVE
            var resData = await findandUpdateExam({ _id: Exam._id }, { status: changedStatus });

            return res.json(new response(resData, responseMessage.EXAM_UPDATED));
        } catch (error) {
            console.log(error)
            return next(error);
        }
    }





    /**
 * @swagger
 * /exam/DeleteExamModeule:
 *   put:
 *     tags:
 *       - Exam Module
 *     description: DeleteExamModeule
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: _id
 *         description: Exam Id
 *         in: query
 *         required: true
 *     responses:
 *       200:
 *         description: Exam Updated successfully
 *       404:
 *         description: not Found
 *       501:
 *         description: Something went wrong.
 *       500:
 *         description: Internal server error.
 */
    async DeleteExamModeule(req, res, next) {
        try {
            let userResult = await findUser({ _id: req.userId, userType: userType.ADMIN })
            if (!userResult) { throw apiError.conflict(responseMessage.UNAUTHORIZED); }
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            let Exam = await CheckExamExits(query)
            if (!Exam) { throw apiError.NOT_FOUND(responseMessage.NOT_FOUND) }
            var resData = await findandUpdateExam({ _id: Exam._id }, { status: status.DELETE });
            if (!resData) { throw apiError.conflict(responseMessage.NOT_FOUND); }
            return res.json(new response(resData, responseMessage.EXAM_UPDATED));
        } catch (error) {
            console.log(error)
            return next(error);
        }
    }

}

export default new ExamModuleController()
