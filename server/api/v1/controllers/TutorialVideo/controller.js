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
import { tutorialServices } from '../../services/tutorialVideo';
const { createTutorialCategory, findTutorialCategory, findTutorialCategoryList, findandUpdateCategory } = tutorialServices;


export class tutorialController {


    /**
     * @swagger
     * /tutorialVideo/addTutorialCategory:
     *   post:
     *     tags:
     *       - TutorialVideo
     *     description: tutorialVideo
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: categoryName
     *         description: categoryName
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
    async addTutorialCategory(req, res, next) {
        const validationSchema = {
            categoryName: Joi.string().required()
        };
        try {
            const validatedBody = await Joi.validate(req.body, validationSchema);
            let query = { categoryName: req.body.categoryName, status : { $ne: 'DELETE' } }
            var tutorialCategory = await findTutorialCategory(query);
            console.log("---=-=-=-validatedBody=-=-=-", validatedBody)
            if (tutorialCategory) {
                throw apiError.conflict(responseMessage.ALREADY_EXITS);

            }
            else {
                var result = await createTutorialCategory(validatedBody)
                return res.json(new response(result, responseMessage.ADD_CATEGORY));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }


    /**
     * @swagger
     * /tutorialVideo/tutorialCategoryList:
     *   get:
     *     tags:
     *       - TutorialVideo
     *     description: tutorialVideo
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
    async tutorialCategoryList(req, res, next) {

        try {

            let query = { status: { $ne: status.DELETE } }
            var tutorialCategoryList = await findTutorialCategoryList(query);
            if (!tutorialCategoryList) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {

                return res.json(new response(tutorialCategoryList, responseMessage.DATA_FOUND));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }



    /**
     * @swagger
     * /tutorialVideo/tutorialCategoryView:
     *   get:
     *     tags:
     *       - TutorialVideo
     *     description: tutorialVideo
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: _id
     *         description: categoryId
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
    async tutorialCategoryView(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };
        try {
            const validatedQuery = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            var tutorialCategory = await findTutorialCategory(query);
            if (!tutorialCategory) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {

                return res.json(new response(tutorialCategory, responseMessage.DATA_FOUND));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }

    /**
 * @swagger
 * /tutorialVideo/tutorialCategoryEdit:
 *   post:
 *     tags:
 *       - TutorialVideo
 *     description: tutorialVideo
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: categoryId
 *         in: query
 *         required: true 
 *       - name: categoryName
 *         description: categoryName
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
    async tutorialCategoryEdit(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };
        const validationBodySchema = {
            categoryName: Joi.string().required()
        };

        try {
            const validatedQuery = await Joi.validate(req.query, validationSchema);
            const validatedBody = await Joi.validate(req.body, validationBodySchema);
            let query = { _id: req.query._id, status : { $ne: 'DELETE' } }
            var tutorialCategory = await findTutorialCategory(query);
            if (!tutorialCategory) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {
                let result = await findandUpdateCategory({ _id: req.query._id }, validatedBody)
                return res.json(new response(result, responseMessage.DATA_FOUND));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }



    /**
* @swagger
* /tutorialVideo/tutorialCategoryDelete:
*   delete:
*     tags:
*       - TutorialVideo
*     description: tutorialVideo
*     produces:
*       - application/json
*     parameters:
*       - name: _id
*         description: categoryId
*         in: query
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
    async tutorialCategoryDelete(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };

        try {
            const validatedQuery = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            var tutorialCategory = await findTutorialCategory(query);
            if (!tutorialCategory) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {
                let result = await findandUpdateCategory({ _id: req.query._id }, { status: status.DELETE })
                return res.json(new response(result, responseMessage.DELETE_SUCCESS));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }


    /**
* @swagger
* /tutorialVideo/tutorialCategoryBlockUnblock:
*   put:
*     tags:
*       - TutorialVideo
*     description: tutorialVideo
*     produces:
*       - application/json
*     parameters:
*       - name: _id
*         description: categoryId
*         in: query
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
    async tutorialCategoryBlockUnblock(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };

        try {
            const validatedQuery = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            var tutorialCategory = await findTutorialCategory(query);
            if (!tutorialCategory) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {
                console.log(tutorialCategory.status)
                let statusChanged = tutorialCategory.status == 'ACTIVE' ? status.BLOCK : status.ACTIVE 
                
                let result = await findandUpdateCategory({ _id: req.query._id }, { status: statusChanged})
                return res.json(new response(result, `Category ${statusChanged} succesfully`));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }
}

export default new tutorialController()