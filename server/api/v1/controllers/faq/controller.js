import Joi from "joi";
import _ from "lodash";
import config from "config";
import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import responseMessage from "../../../../../assets/responseMessage";
import axios from "axios";

import { staticServices } from "../../services/static";
const {
    createStaticContent,
    findStaticContent,
    updateStaticContent,
    staticContentList,
} = staticServices;

import { TestimonialServices } from "../../services/TestimonialServices";
const { createTestimonial, findTestimonial, updateTestimonial, createStory, findStory, updateStory } =
    TestimonialServices;

import { faqServices } from "../../services/faq";
const { createFAQ, findFAQ, updateFAQ, faqListWithPagination, FAQList, findFAQCategory, createFAQCategory, updateFAQCategory, FAQListCategory } = faqServices;

import { userServices } from "../../services/user";
const { findUser } = userServices;
import status from "../../../../enums/status";
import userType from "../../../../enums/userType";

export class staticController {
    /**
     * @swagger
     * /static/addStaticContent:
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
            description: Joi.string().required(),
        };
        try {
            const validatedBody = await Joi.validate(req.body, validationSchema);
            const { type, title, description } = validatedBody;
            const findRes = await findStaticContent({
                type: type,
                status: { $ne: status.DELETE },
            });
            if (findRes) {
                throw apiError.conflict(responseMessage.STATIC_CONTENT);
            }
            const result = await createStaticContent({
                type: type,
                title: title,
                description: description,
            });
            return res.json(new response(result, responseMessage.DATA_SAVED));
        } catch (error) {
            return next(error);
        }
    }

    /**
     * @swagger
     * /static/deleteStaticContent:
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
            const result = await findStaticContent({ _id: validatedBody._id });
            if (!result) throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            const updateRes = await updateStaticContent(
                { _id: result._id },
                { status: status.DELETE }
            );
            return res.json(new response(updateRes, responseMessage.DATA_FOUND));
        } catch (error) {
            return next(error);
        }
    }

    /**
     * @swagger
     * /static/staticContentList:
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
            url: Joi.string().optional(),
        };
        try {
            const validatedBody = await Joi.validate(req.body, validationSchema);
            let staticRes = await findStaticContent(
                { _id: req.body._id },
                { status: { $ne: status.DELETE } }
            );
            if (staticRes) throw apiError.notFound(responseMessage.STATIC_NOT_FOUND);
            const result = await updateStaticContent(
                { _id: validatedBody._id },
                validatedBody
            );
            return res.json(new response(result, responseMessage.UPDATE_SUCCESS));
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }

    /**
     * @swagger
     * /static/staticContentList:
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
            const result = await staticContentList({
                status: { $ne: status.DELETE },
            });
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            return next(error);
        }
    }

    //**************************  FAQs management Start *****************************************************/


    /**
    * @swagger
    * /faq/addFAQCategory:
    *   post:
    *     tags:
    *       - FAQ_MANAGEMENT
    *     description: addFAQ
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: token
    *         description: token
    *         in: header
    *         required: true
    *       - name: categoryName
    *         description: categoryName
    *         in: formData
    *         required: true
    *     responses:
    *       200:
    *         description: Returns success message
    */
    async addFAQCategory(req, res, next) {
        const validationSchema = {
            categoryName: Joi.string().required()
        };
        try {
            const { question, answer, categoryId } = await Joi.validate(req.body, validationSchema)
            let findCategory = await findFAQCategory({ categoryName: req.body.categoryName, status: { $ne: status.DELETE } })
            if (findCategory) {
                throw apiError.notFound(responseMessage.ALREADY_EXITS);
            }
            else {
                const result = await createFAQCategory(req.body);
                return res.json(new response(result, responseMessage.FAQ_ADDED));
            }

        } catch (error) {
            return next(error);
        }
    }


    /**
     * @swagger
     * /faq/editFAQCategory:
     *   put:
     *     tags:
     *       - FAQ_MANAGEMENT
     *     description: addFAQ
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
     *       - name: categoryName
     *         description: categoryName
     *         in: formData
     *         required: true
     *     responses:
     *       200:
     *         description: Returns success message
     */
    async editFAQCategory(req, res, next) {
        const validationSchema = {
            categoryName: Joi.string().required()
        };
        try {
            const { categoryName } = await Joi.validate(req.body, validationSchema)
            let findCategory = await findFAQCategory({ _id: req.query._id, status: { $ne: status.DELETE } })
            if (!findCategory) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            else {
                const result = await updateFAQCategory({ _id: req.query._id }, req.body);
                return res.json(new response(result, responseMessage.FAQ_ADDED));
            }

        } catch (error) {
            return next(error);
        }
    }


    /**
   * @swagger
   * /faq/deleteFAQCategory:
   *   delete:
   *     tags:
   *       - FAQ_MANAGEMENT
   *     description: addFAQ
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
    async deleteFAQCategory(req, res, next) {

        try {

            let findCategory = await findFAQCategory({ _id: req.query._id, status: { $ne: status.DELETE } })
            if (!findCategory) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            else {
                const result = await updateFAQCategory({ _id: req.query._id }, { status: status.DELETE });
                return res.json(new response(result, responseMessage.DELETE_SUCCESS));
            }

        } catch (error) {
            return next(error);
        }
    }



    /**
* @swagger
* /faq/blockUnblockFAQCategory:
*   put:
*     tags:
*       - FAQ_MANAGEMENT
*     description: addFAQ
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
    async blockUnblockFAQCategory(req, res, next) {

        try {

            let findCategory = await findFAQCategory({ _id: req.query._id, status: { $ne: status.DELETE } })
            if (!findCategory) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            else {
                let statuschanged = findCategory.status == status.ACTIVE ? status.BLOCK : status.ACTIVE
                const result = await updateFAQCategory({ _id: req.query._id }, { status: statuschanged });
                return res.json(new response(result, responseMessage.UPDATE_SUCCESS));
            }

        } catch (error) {
            return next(error);
        }
    }


    /**
    * @swagger
    * /faq/listFAQCategory:
    *   get:
    *     tags:
    *       - FAQ_MANAGEMENT
    *     description: addFAQ
    *     produces:
    *       - application/json
    *     responses:
    *       200:
    *         description: Returns success message
    */
    async listFAQCategory(req, res, next) {

        try {

            let findCategoryList = await FAQListCategory({ status: { $ne: status.DELETE } })
            if (!findCategoryList || !findCategoryList.length) {
                throw apiError.notFound(responseMessage.ALREADY_EXITS);
            }
            else {
                return res.json(new response(findCategoryList, responseMessage.FAQ_ADDED));
            }

        } catch (error) {
            return next(error);
        }
    }


    /**
     * @swagger
     * /faq/addFAQ:
     *   post:
     *     tags:
     *       - FAQ_MANAGEMENT
     *     description: addFAQ
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: categoryId
     *         description: categoryId
     *         in: formData
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
     *         description: Returns success message
     */
    async addFAQ(req, res, next) {
        const validationSchema = {
            question: Joi.string().required(),
            answer: Joi.string().required(),
            categoryId: Joi.string().required(),
        };
        try {
            const { question, answer, categoryId } = await Joi.validate(req.body, validationSchema)
            let findCategory = await findFAQCategory({ _id: req.body.categoryId, status: { $ne: status.DELETE } })
            console.log();
            if (!findCategory) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            else {
                const result = await createFAQ({ question: question, answer: answer, categoryId: categoryId });
                return res.json(new response(result, responseMessage.FAQ_ADDED));
            }

        } catch (error) {
            return next(error);
        }
    }

    /**
     * @swagger
     * /faq/viewFAQ/{_id}:
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
            const result = await findFAQ(
                { _id: validatedBody._id },
                { status: { $ne: status.DELETE } }
            );
            if (!result) throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            return next(error);
        }
    }

    /**
     * @swagger
     * /faq/editFAQ:
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
     *       - name: _id
     *         description: _id
     *         in: formData
     *         required: true
     *       - name: categoryId
     *         description: categoryId
     *         in: formData
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
     *         description: Returns success message
     */
    async editFAQ(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required(),
            question: Joi.string().required(),
            answer: Joi.string().required(),
            categoryId: Joi.string().required(),
        };
        try {
            const validatedBody = await Joi.validate(req.body, validationSchema);
            let adminRes = await findUser(
                { _id: req.userId },
                { userType: userType.ADMIN }
            );
            if (!adminRes) throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            let findCategory = await findFAQCategory({ _id: req.body.categoryId, status: { $ne: status.DELETE } })

            if (!findCategory) { 
              
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND); 
            }
            let faqFind = await findFAQ(
                { _id: validatedBody._id },
                { status: { $ne: status.DELETE } }
            );

            if (!faqFind) { 
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND); 
            }
            const result = await updateFAQ({ _id: faqFind._id }, validatedBody);
            return res.json(new response(result, responseMessage.UPDATE_SUCCESS));
        } catch (error) {
            return next(error);
        }
    }

    /**
     * @swagger
     * /faq/deleteFAQ:
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
            _id: Joi.string().required(),
        };
        try {
            const validatedBody = await Joi.validate(req.body, validationSchema);
            let userResult = await findUser({
                _id: req.userId,
                userType: { $in: "ADMIN" },
            });
            if (!userResult) throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            const faqInfo = await findFAQ({
                _id: validatedBody._id,
                status: { $ne: status.DELETE },
            });
            if (!faqInfo) throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            let deleteRes = await updateFAQ(
                { _id: faqInfo._id },
                { status: status.DELETE }
            );
            return res.json(new response(deleteRes, responseMessage.DELETE_SUCCESS));
        } catch (error) {
            return next(error);
        }
    }

    /**
     * @swagger
     * /faq/faqList:
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
            limit: Joi.string().optional(),
        };
        try {
            const validatedBody = await Joi.validate(req.query, validationSchema);
            const result = await faqListWithPagination(validatedBody);
            if (result.docs.length == 0)
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            return next(error);
        }
    }

    //**************************  FAQs management End *************************************************/

    //**************************  Testimonial management Start *************************************************/

    /**
     * @swagger
     * /Testimonial/addTestimonial:
     *   post:
     *     tags:
     *       - TESTIMONIAL MANAGEMENT
     *     description: addTestimonial
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: addTestimonial
     *         description: addTestimonial
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/addTestimonial'
     *     responses:
     *       200:
     *         description: Returns success message
     */
    async addTestimonial(req, res, next) {
        const validationSchema = {
            Testimonial_no: Joi.string().required(),
            title: Joi.string().required(),
            description: Joi.string().required(),
        };
        try {
            const { Testimonial_no, title, description } = await Joi.validate(
                req.body,
                validationSchema
            );
            const result = await createTestimonial({
                Testimonial_no: Testimonial_no,
                title: title,
                description: description,
            });
            return res.json(new response(result, responseMessage.TESTIMONIAL_ADDED));
        } catch (error) {
            return next(error);
        }
    }

    /**
     * @swagger
     * /Testimonial/editTestimonial:
     *   put:
     *     tags:
     *       - TESTIMONIAL MANAGEMENT
     *     description: editTestimonial
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: token
     *         description: token
     *         in: header
     *         required: true
     *       - name: editTestimonial
     *         description: editTestimonial
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/editTestimonial'
     *     responses:
     *       200:
     *         description: Returns success message
     */
    async editTestimonial(req, res, next) {
        try {
            const validatedBody = await Joi.validate(req.body);
            const { TestimonalID, Testimonial_no, title, description } = validatedBody
            let Res = await findTestimonial(
                { _id: req.body.TestimonalID },
                { status: { $ne: status.DELETE } }
            );
            if (Res) {
                throw apiError.notFound(responseMessage.TESTIMONIAL_NOT_FOUND);
            }
            const result = await updateTestimonial({ _id: validatedBody._id }, validatedBody);
            return res.json(new response(result, responseMessage.UPDATE_SUCCESS));
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }

    /**
     * @swagger
     * /Testimonial/viewTestimonial/{_id}:
     *   get:
     *     tags:
     *       - TESTIMONIAL MANAGEMENT
     *     description: viewTestimonial
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
    async viewTestimonial(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required(),
        };
        try {
            const validatedBody = await Joi.validate(req.params, validationSchema);
            const result = await findTestimonial(
                { _id: validatedBody._id },
                { status: { $ne: status.DELETE } }
            );
            if (!result) throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            return next(error);
        }
    }

    /**
     * @swagger
     * /Story/addStory:
     *   post:
     *     tags:
     *       - STORY MANAGEMENT
     *     description: addStory
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: addStory
     *         description: addStory
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/addStory'
     *     responses:
     *       200:
     *         description: Returns success message
     */
    async addStory(req, res, next) {
        const validationSchema = {
            Story_no: Joi.string().required(),
            title: Joi.string().required(),
            description: Joi.string().required(),
        };
        try {
            const { Story_no, title, description } = await Joi.validate(
                req.body,
                validationSchema
            );
            const result = await createStory({
                Story_no: Story_no,
                title: title,
                description: description,
            });
            return res.json(new response(result, responseMessage.TESTIMONIAL_ADDED));
        } catch (error) {
            return next(error);
        }
    }


    /**
     * @swagger
     * /Story/viewStory/{_id}:
     *   get:
     *     tags:
     *       - STORY MANAGEMENT
     *     description: viewStory
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
    async viewStory(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required(),
        };
        try {
            const validatedBody = await Joi.validate(req.params, validationSchema);

            const result = await findStory(
                { _id: validatedBody._id },
                { status: { $ne: status.DELETE } }
            );
            if (!result) throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            return next(error);
        }
    }

    /**
 * @swagger
 * /Story/editStory:
 *   put:
 *     tags:
 *       - TESTIMONIAL MANAGEMENT
 *     description: editStory
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: editStory
 *         description: editStory
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/editStory'
 *     responses:
 *       200:
 *         description: Returns success message
 */
    async editStory(req, res, next) {
        try {
            const validatedBody = await Joi.validate(req.body);
            const { StoryID, Story_no, title, description } = validatedBody
            let Res = await findStory({ _id: validatedBody.StoryID }, { status: { $ne: status.DELETE } });
            if (Res) {
                throw apiError.notFound(responseMessage.STORY_NOT_FOUND);
            }
            const result = await updateStory({ _id: validatedBody._id }, validatedBody);
            return res.json(new response(responseMessage.UPDATE_SUCCESS, result));
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }
}
export default new staticController();
