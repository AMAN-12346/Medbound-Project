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
import { blogServices } from '../../services/blogService';
const { createBlog, findBlog, findBlogList, findandUpdateBlog } = blogServices;


export class blogController {


    /**
    * @swagger
    * /blog/addBlog:
    *   post:
    *     tags:
    *       - Blog
    *     description: Blog
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: title
    *         description: title
    *         in: formData
    *         required: true
    *       - name: description
    *         description: escription
    *         in: formData
    *         required: true
    *       - name: image
    *         description: image
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
    async addBlog(req, res, next) {
        const validationSchema = {
            title: Joi.string().required(),
            description: Joi.string().required(),
            image: Joi.string().required()
        };
        try {
            const validatedBody = await Joi.validate(req.body, validationSchema);
            let query = { title: req.body.title, status: { $ne: 'DELETE' } }
            var find = await findBlog(query);
            console.log("---=-=-=-validatedBody=-=-=-", validatedBody)
            if (find) {
                throw apiError.conflict(responseMessage.ALREADY_EXITS);

            }
            else {
                var result = await createBlog(validatedBody)
                return res.json(new response(result, responseMessage.ADD_SUCCESS));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }


    /**
     * @swagger
     * /blog/blogList:
     *   get:
     *     tags:
     *       - Blog
     *     description: Blog
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
    async blogList(req, res, next) {

        try {

            let query = { status: { $ne: status.DELETE } }
            let appen =  await queryHandler.queryWithoutPagination(req.query)

            let finalQuery = {
                ...query,
                ...appen
            }


            var list = await findBlogList(finalQuery);
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
     * /blog/blogView:
     *   get:
     *     tags:
     *       - Blog
     *     description: Blog
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

    async blogView(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };
        try {
            const validatedQuery = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            var find = await findBlog(query);
            if (!find) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {

                return res.json(new response(find, responseMessage.DATA_FOUND));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }

    /**
     * @swagger
     * /blog/blogEdit:
     *   put:
     *     tags:
     *       - Blog
     *     description: Blog
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: _id
     *         description: _id
     *         in: query
     *         required: true 
     *       - name: title
     *         description: title
     *         in: formData
     *         required: true 
     *       - name: description
     *         description: description
     *         in: formData
     *         required: true 
     *       - name: image
     *         description: image
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

    async blogEdit(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };
        const validationBodySchema = {
            title: Joi.string().required(),
            description: Joi.string().required(),
            image: Joi.string().required()
        };

        try {
            const validatedQuery = await Joi.validate(req.query, validationSchema);
            const validatedBody = await Joi.validate(req.body, validationBodySchema);
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            var find = await findBlog(query);
            if (!find) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {
                let result = await findandUpdateBlog({ _id: req.query._id }, validatedBody)
                return res.json(new response(result, responseMessage.DATA_SAVED));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }



    /**
    * @swagger
    * /blog/blogDelete:
    *   delete:
    *     tags:
    *       - Blog
    *     description: Blog
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


    async blogDelete(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };

        try {
            const validatedQuery = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            var find = await findBlog(query);
            if (!find) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {
                let result = await findandUpdateBlog({ _id: req.query._id }, { status: status.DELETE })
                return res.json(new response(result, responseMessage.DELETE_SUCCESS));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }


    /**
    * @swagger
    * /blog/blogBlockUnblock:
    *   put:
    *     tags:
    *       - Blog
    *     description: Blog
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
   
    async blogBlockUnblock(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };

        try {
            const validatedQuery = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            var find = await findBlog(query);
            if (!find) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {

                let statusChanged = find.status == 'ACTIVE' ? status.BLOCK : status.ACTIVE

                let result = await findandUpdateBlog({ _id: req.query._id }, { status: statusChanged })
                return res.json(new response(result, `Blog ${statusChanged} succesfully`));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }
}

export default new blogController()