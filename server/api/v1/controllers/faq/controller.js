import Joi from "joi";
import _ from "lodash";
import config from "config";
import apiError from '../../../../helper/apiError';
import response from '../../../../../assets/response';
import responseMessage from '../../../../../assets/responseMessage';
import axios from 'axios';

import { staticServices } from '../../services/static';
const { createStaticContent, findStaticContent, updateStaticContent, staticContentList } = staticServices;

import { faqServices } from '../../services/faq';
const { createFAQ, findFAQ, updateFAQ, faqListWithPagination, FAQList } = faqServices;


import { userServices } from '../../services/user';
const { findUser } = userServices;
import status from '../../../../enums/status';
import userType from '../../../../enums/userType';

export class staticController {

    /**
     * @swagger
     * /static/static:
     *   post:
     *     tags:
     *       - STATIC
     *     description: addStaticContent
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: addStaticContent
     *         description: addStaticContent
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/addStaticContent'
     *     responses:
     *       200:
     *         description: Returns success message
     */
    async addStaticContent(req, res, next) {
        const validationSchema = {
            type: Joi.string().required(),
            title: Joi.string().required(),
            description: Joi.string().required()
        };
        try {
            const validatedBody = await Joi.validate(req.body, validationSchema);
            const { type, title, description } = validatedBody;
            const findRes = await findStaticContent({ type: type, status: { $ne: status.DELETE } })
            if (findRes) {
                throw apiError.conflict(responseMessage.STATIC_CONTENT);
            }
            const result = await createStaticContent({ type: type, title: title, description: description })
            return res.json(new response(result, responseMessage.DATA_SAVED));
        } catch (error) {
            return next(error);
        }
    }

    /**
     * @swagger
     * /static/static:
     *   delete:
     *     tags:
     *       - STATIC
     *     description: deleteStaticContent
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
     *         description: Returns success message
     */
    async deleteStaticContent(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required(),
        };
        try {
            const validatedBody = await Joi.validate(req.query, validationSchema);
            const result = await findStaticContent({ _id: validatedBody._id })
            if (!result) throw apiError.notFound(responseMessage.DATA_NOT_FOUND)
            const updateRes = await updateStaticContent({ _id: result._id }, { status: status.DELETE })
            return res.json(new response(updateRes, responseMessage.DATA_FOUND));
        } catch (error) {
            return next(error);
        }
    }

    /**
     * @swagger
     * /static/static:
     *   put:
     *     tags:
     *       - STATIC
     *     description: editStaticContent
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: editStaticContent
     *         description: editStaticContent
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/editStaticContent'
     *     responses:
     *       200:
     *         description: Returns success message
     */
    async editStaticContent(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required(),
            title: Joi.string().optional(),
            description: Joi.string().optional(),
            url: Joi.string().optional()

        };
        try {
            const validatedBody = await Joi.validate(req.body, validationSchema);
            let staticRes = await findStaticContent({ _id: req.body._id },{status : {$ne : status.DELETE}})
            if (staticRes) throw apiError.notFound(responseMessage.STATIC_NOT_FOUND)
            const result = await updateStaticContent({ _id: validatedBody._id }, validatedBody)
            return res.json(new response(result, responseMessage.UPDATE_SUCCESS));
        } catch (error) {
            console.log(error)
            return next(error);
        }
    }

    /**
     * @swagger
     * /static/static:
     *   get:
     *     tags:
     *       - STATIC
     *     description: staticContentList
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Returns success message
     */
    async staticContentList(req, res, next) {
        try {
            const result = await staticContentList({ status: { $ne: status.DELETE } })
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            return next(error);
        }
    }

    //**************************  FAQs management Start *****************************************************/

    /**
     * @swagger
     * /faq/faq:
     *   post:
     *     tags:
     *       - FAQ_MANAGEMENT
     *     description: addFAQ
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: addFAQ
     *         description: addFAQ
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/addFAQ'
     *     responses:
     *       200:
     *         description: Returns success message
     */
    async addFAQ(req, res, next) {
        const validationSchema = {
            question: Joi.string().required(),
            answer: Joi.string().required()
        };
        try {
            const { question, answer } = await Joi.validate(req.body, validationSchema);
            const result = await createFAQ({ question: question, answer: answer })
            return res.json(new response(result, responseMessage.FAQ_ADDED));
        } catch (error) {
            return next(error);
        }
    }

    /**
     * @swagger
     * /faq/faq/{_id}:
     *   get:
     *     tags:
     *       - FAQ_MANAGEMENT
     *     description: viewFAQ
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: _id
     *         description: _id
     *         in: path
     *         required: true
     *     responses:
     *       200:
     *         description: Returns success message
     */
    async viewFAQ(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required(),
        };
        try {
            const validatedBody = await Joi.validate(req.params, validationSchema);
            const result = await findFAQ({ _id: validatedBody._id }, { status: { $ne: status.DELETE } })
            if (!result) throw apiError.notFound(responseMessage.DATA_NOT_FOUND)
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            return next(error);
        }
    }

    /**
     * @swagger
     * /faq/faq:
     *   put:
     *     tags:
     *       - FAQ_MANAGEMENT
     *     description: editFAQ
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: token
     *         description: token
     *         in: header
     *         required: true
     *       - name: editFAQ
     *         description: editFAQ
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/editFAQ'
     *     responses:
     *       200:
     *         description: Returns success message
     */
    async editFAQ(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required(),
            question: Joi.string().optional(),
            answer: Joi.string().optional()
        };
        try {
            const validatedBody = await Joi.validate(req.body, validationSchema);
            let adminRes = await findUser({ _id: req.userId }, {userType : userType.ADMIN})
            if (!adminRes) throw apiError.notFound(responseMessage.USER_NOT_FOUND)
            let faqFind = await findFAQ({ _id: validatedBody._id }, {status : {$ne : status.DELETE}})
            if (faqFind) throw apiError.notFound(responseMessage.DATA_NOT_FOUND)
            const result = await updateFAQ({ _id: faqFind._id }, validatedBody)
            return res.json(new response(result, responseMessage.UPDATE_SUCCESS));
        } catch (error) {
            return next(error);
        }
    }

    /**
     * @swagger
     * /faq/faq:
     *   delete:
     *     tags:
     *       - FAQ_MANAGEMENT
     *     description: deleteFAQ
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: token
     *         description: token
     *         in: header
     *         required: true
     *       - name: deleteFAQ
     *         description: deleteFAQ
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/deleteFAQ'
     *     responses:
     *       200:
     *         description: Returns success message
     */
    async deleteFAQ(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };
        try {
            const validatedBody = await Joi.validate(req.body, validationSchema);
            let userResult = await findUser({ _id: req.userId, userType: { $in: "ADMIN" } });
            if (!userResult) throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            const faqInfo = await findFAQ({ _id: validatedBody._id, status: { $ne: status.DELETE } });
            if (!faqInfo) throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            let deleteRes = await updateFAQ({ _id: faqInfo._id }, { status: status.DELETE });
            return res.json(new response(deleteRes, responseMessage.DELETE_SUCCESS));
        } catch (error) {
            return next(error);
        }
    }

    /**
     * @swagger
     * /faq/faq:
     *   get:
     *     tags:
     *       - FAQ_MANAGEMENT
     *     description: faqList
     *     parameters:
     *       - name: page
     *         description: page
     *         in: query
     *         required: false
     *       - name: limit
     *         description: limit
     *         in: query
     *         required: false
     *     responses:
     *       200:
     *         description: Returns success message
     */
    async faqList(req, res, next) {
        let validationSchema = {
            // search: Joi.string().optional(),
            page: Joi.number().optional(),
            limit: Joi.string().optional()
        }
        try {
            const validatedBody = await Joi.validate(req.query, validationSchema);
            const result = await faqListWithPagination(validatedBody)
            if (result.docs.length == 0) throw apiError.notFound(responseMessage.DATA_NOT_FOUND)
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            return next(error);
        }
    }

    //**************************  FAQs management End *************************************************/

}
export default new staticController()