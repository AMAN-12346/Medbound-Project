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
import { medBoundTimesService } from '../../services/medBoundTimesService';
const { create, find, findList, findandUpdate } = medBoundTimesService;


export class medBoundTimesController {


    /**
     * @swagger
     * /medBoundTimes/medBoundTimesList:
     *   get:
     *     tags:
     *       - medBoundTimes
     *     description: medBoundTimes
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
    async medBoundTimesList(req, res, next) {

        try {

            let query = { status: { $ne: status.DELETE } }
            var list = await find(query);
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
     * /medBoundTimes/medBoundTimesView:
     *   get:
     *     tags:
     *       - medBoundTimes
     *     description: medBoundTimes
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: type
     *         description: about / internship / career
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

    async medBoundTimesView(req, res, next) {
        const validationSchema = {
            type: Joi.string().required()
        };
        try {
            const validatedQuery = await Joi.validate(req.query, validationSchema);
            const type = req.query.type
            let query = { status: { $ne: status.DELETE } }
            var finds = await find(query);
            if (!finds) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else if (type != "about" && type != 'internship' && type != 'career') {
                throw apiError.conflict(responseMessage.NOT_FOUND);
            }
            else {
                let result = finds[type]
                console.log(result);

                return res.json(new response(result, responseMessage.DATA_FOUND));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }

    /**
     * @swagger
     * /medBoundTimes/updateAbout:
     *   put:
     *     tags:
     *       - medBoundTimes
     *     description: medBoundTimes
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: description
     *         description: description
     *         in: body
     *         required: true
     *       - name: features
     *         description: features
     *         in: body
     *         required: true
     *       - name: bulletin
     *         description: bulletin
     *         in: body
     *         required: true
     *       - name: link
     *         description: link
     *         in: body
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

    async updateAbout(req, res, next) {

        try {
           
            let query = { status: { $ne: 'DELETE' } }
            var finds = await find(query);
            if (!finds) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {
                console.log(finds)
                let body = req.body
                body['updatedAt'] = new Date().toISOString()
                finds.about = body
                let result = await findandUpdate({ _id: finds._id }, finds)
                return res.json(new response(finds.about, responseMessage.DATA_SAVED));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }


     /**
     * @swagger
     * /medBoundTimes/updateInternship:
     *   put:
     *     tags:
     *       - medBoundTimes
     *     description: medBoundTimes
     *     produces:
     *       - application/json
     *     parameters:
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
     *       - name: link
     *         description: link
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

      async updateInternship(req, res, next) {

        try {
           
            let query = { status: { $ne: 'DELETE' } }
            var finds = await find(query);
            if (!finds) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {
                console.log(finds)
                let body = req.body
                body['updatedAt'] = new Date().toISOString()
                finds.internship = body
                let result = await findandUpdate({ _id: finds._id }, finds)
                return res.json(new response(finds.internship, responseMessage.DATA_SAVED));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }


         /**
     * @swagger
     * /medBoundTimes/updateCareer:
     *   put:
     *     tags:
     *       - medBoundTimes
     *     description: medBoundTimes
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: courseName
     *         description: courseName
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
     *       - name: link
     *         description: link
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

          async updateCareer(req, res, next) {

            try {
               
                let query = { status: { $ne: 'DELETE' } }
                var finds = await find(query);
                if (!finds) {
                    throw apiError.conflict(responseMessage.NOT_FOUND);
    
                }
                else {
                    console.log(finds)
                    let body = req.body
                    body['updatedAt'] = new Date().toISOString()
                    finds.career = body
                    let result = await findandUpdate({ _id: finds._id }, finds)
                    return res.json(new response(finds.career, responseMessage.DATA_SAVED));
    
                }
            } catch (error) {
                console.log("error ==========> 79", error)
                return next(error);
            }
        }
    



}

export default new medBoundTimesController()