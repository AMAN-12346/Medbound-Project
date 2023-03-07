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
import { tutorialVideoServices } from '../../services/tutorialVideoByCategory';
const { createTutorialVideo, findTutorialVideo, findTutorialVideoList, findandUpdateVideo } = tutorialVideoServices;
import { tutorialServices } from '../../services/tutorialVideo';
const { createTutorialCategory, findTutorialCategory, findTutorialCategoryList, findandUpdateCategory } = tutorialServices;


export class tutorialController {


    /**
     * @swagger
     * /tutorialVideoByCategory/addTutorialVideo:
     *   post:
     *     tags:
     *       - TutorialVideo
     *     description: tutorialVideo
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: categoryId
     *         description: categoryId
     *         in: formData
     *         required: true
     *       - name: tutorialName
     *         description: tutorialName
     *         in: formData
     *         required: true
     *       - name: tutorialVideoUrl
     *         description: tutorialVideoUrl
     *         in: formData
     *         required: true
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
    async addTutorialVideo(req, res, next) {
        const validationSchema = {
            categoryId: Joi.string().required(),
            tutorialName : Joi.string().required(),
            tutorialVideoUrl : Joi.string().required(),
            description : Joi.string().required(),
        };
        try {
            const validatedBody = await Joi.validate(req.body, validationSchema);
            let query = { tutorialName : req.body.tutorialName, categoryId : req.body.categoryId, status : { $ne: 'DELETE' } }
            var tutorialVideo = await findTutorialVideo(query);
            if (tutorialVideo) {
                throw apiError.conflict(responseMessage.ALREADY_EXITS);

            }
            else {
                var result = await createTutorialVideo(validatedBody)
                return res.json(new response(result, responseMessage.ADD_SUCCESS));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }


    /**
     * @swagger
     * /tutorialVideoByCategory/tutorialVideoList:
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
    async tutorialVideoList(req, res, next) {

        try {

            let query = { status: { $ne: status.DELETE } }
            var tutorialCategoryList = await findTutorialVideoList(query);
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
     * /tutorialVideoByCategory/tutorialVideoView:
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
    async tutorialVideoView(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };
        try {
            const validatedQuery = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            var tutorialCategory = await findTutorialVideo(query);
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
 * /tutorialVideoByCategory/tutorialVideoEdit:
 *   post:
 *     tags:
 *       - TutorialVideo
 *     description: tutorialVideo
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: categoryId
 *         description: categoryId
 *         in: formData
 *         required: true 
 *       - name: _id
 *         description: _id
 *         in: query
 *         required: true 
 *       - name: tutorialName
 *         description: tutorialName
 *         in: formData
 *         required: true 
 *       - name: tutorialVideoUrl
 *         description: tutorialVideoUrl
 *         in: formData
 *         required: true 
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
    async tutorialVideoEdit(req, res, next) {
      
        const validationBodySchema = {
            categoryId: Joi.string().required(),
            tutorialName : Joi.string().required(),
            tutorialVideoUrl : Joi.string().required(),
            description : Joi.string().required(),
        };

        try {
            const validatedBody = await Joi.validate(req.body, validationBodySchema);
            let query = { _id: req.query._id, status : { $ne: 'DELETE' } }
            let findCategory = {_id: req.body.categoryId, status : { $ne: 'DELETE'}}
            var tutorialCategory = await findTutorialCategory(findCategory);
            if (!tutorialCategory) {
                throw apiError.conflict(`Category ${responseMessage.NOT_FOUND}`);

            }

            var tutorialVideo = await findTutorialVideo(query);
            if (!tutorialVideo) {
                throw apiError.conflict(`Video ${responseMessage.NOT_FOUND}`);

            }
            else {
                let result = await findandUpdateVideo({ _id: req.query._id }, validatedBody)
                return res.json(new response(result, responseMessage.DATA_FOUND));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }



    /**
* @swagger
* /tutorialVideoByCategory/tutorialVideoDelete:
*   delete:
*     tags:
*       - TutorialVideo
*     description: tutorialVideo
*     produces:
*       - application/json
*     parameters:
*       - name: _id
*         description: _id
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
    async tutorialVideoDelete(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };

        try {
            const validatedQuery = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            var tutorialCategory = await findTutorialVideo(query);
            if (!tutorialCategory) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {
                let result = await findandUpdateVideo({ _id: req.query._id }, { status: status.DELETE })
                return res.json(new response(result, responseMessage.DELETE_SUCCESS));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }


    /**
* @swagger
* /tutorialVideoByCategory/tutorialVideoBlockUnblock:
*   put:
*     tags:
*       - TutorialVideo
*     description: tutorialVideo
*     produces:
*       - application/json
*     parameters:
*       - name: _id
*         description: _id
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
    async tutorialVideoBlockUnblock(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };

        try {
            const validatedQuery = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            var tutorialCategory = await findTutorialVideo(query);
            if (!tutorialCategory) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {
                console.log(tutorialCategory.status)
                let statusChanged = tutorialCategory.status == 'ACTIVE' ? status.BLOCK : status.ACTIVE 
                
                let result = await findandUpdateVideo({ _id: req.query._id }, { status: statusChanged})
                return res.json(new response(result, `Category ${statusChanged} succesfully`));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }




    /**
* @swagger
* /tutorialVideoByCategory/tutorialVideoByCategoryId:
*   get:
*     tags:
*       - TutorialVideo
*     description: tutorialVideo
*     produces:
*       - application/json
*     parameters:
*       - name: categoryId
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
async tutorialVideoByCategoryId(req, res, next) {
    const validationSchema = {
        categoryId: Joi.string().required()
    };

    try {
        const validatedQuery = await Joi.validate(req.query, validationSchema);
        let query = { categoryId : req.query.categoryId, status: { $ne: 'DELETE' } }
        var tutorialCategory = await findTutorialVideo(query);
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
}

export default new tutorialController()