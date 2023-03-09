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
const { create, find, findList, findandUpdate } = examModeleService;


export class ExamModuleController {



   /**
* @swagger
* /examModule/listExamModule:
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
async listExamModule(req, res, next) {
   
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

export default new ExamModuleController()