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
import { flashCardsServices } from '../../services/flashCards';
import queryHandler from '../../../../helper/query';

const { createFlashCardCategory, findFlashCardCategory, findFlashCardCategoryList, findandUpdateFlashCardCategory, createFlashCardSubCategory,
    findFlashCardSubCategory, findFlashCardSubCategoryList, findandUpdateFlashCardSubCategory
    , createFlashCard, findFlashCard, findFlashCardList, findandUpdateFlashCard
} = flashCardsServices;


export class flashCard {


    /**
     * @swagger
     * /flashCard/addFlashcardCategory:
     *   post:
     *     tags:
     *       - FlashCards
     *     description: flashCards
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
    async addFlashcardCategory(req, res, next) {
        const validationSchema = {
            categoryName: Joi.string().required()
        };
        try {
            const validatedBody = await Joi.validate(req.body, validationSchema);
            let query = { categoryName: req.body.categoryName, status: { $ne: 'DELETE' } }
            var category = await findFlashCardCategory(query);
            console.log("---=-=-=-validatedBody=-=-=-", validatedBody)
            if (category) {
                throw apiError.conflict(responseMessage.ALREADY_EXITS);

            }
            else {
                var result = await createFlashCardCategory(validatedBody)
                return res.json(new response(result, responseMessage.ADD_CATEGORY));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }


    /**
     * @swagger
     * /flashCard/flashcardCategoryList:
     *   get:
     *     tags:
     *       - FlashCards
     *     description: flashCards
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
    async flashcardCategoryList(req, res, next) {

        try {

            let query = { status: { $ne: status.DELETE } }
            let appen =  await queryHandler.queryWithoutPagination(req.query)

            let finalQuery = {
                ...query,
                ...appen
            }
            var categoryList = await findFlashCardCategory(finalQuery);
            if (!categoryList) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {

                return res.json(new response(categoryList, responseMessage.DATA_FOUND));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }



    /**
     * @swagger
     * /flashCard/flashcardCategoryView:
     *   get:
    *     tags:
     *       - FlashCards
     *     description: flashCards
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
    async flashcardCategoryView(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };
        try {
            const validatedQuery = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            var category = await findFlashCardCategory(query);
            if (!category) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {

                return res.json(new response(category, responseMessage.DATA_FOUND));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }

    /**
 * @swagger
 * /flashCard/flashcardCategoryEdit:
 *   post:
     *     tags:
     *       - FlashCards
     *     description: flashCards
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
    async flashcardCategoryEdit(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };
        const validationBodySchema = {
            categoryName: Joi.string().required()
        };

        try {
            const validatedQuery = await Joi.validate(req.query, validationSchema);
            const validatedBody = await Joi.validate(req.body, validationBodySchema);
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            var category = await findFlashCardCategory(query);
            if (!category) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {
                let result = await findandUpdateFlashCardCategory({ _id: req.query._id }, validatedBody)
                return res.json(new response(result, responseMessage.DATA_FOUND));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }



    /**
* @swagger
* /flashCard/flashcardCategoryDelete:
*   delete:
     *     tags:
     *       - FlashCards
     *     description: flashCards
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
    async flashcardCategoryDelete(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };

        try {
            const validatedQuery = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            var category = await findFlashCardCategory(query);
            if (!category) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {
                let result = await findandUpdateFlashCardCategory({ _id: req.query._id }, { status: status.DELETE })
                return res.json(new response(result, responseMessage.DELETE_SUCCESS));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }


    /**
* @swagger
* /flashCard/flashcardCategoryBlockUnblock:
*   put:
     *     tags:
     *       - FlashCards
     *     description: flashCards
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
    async flashcardCategoryBlockUnblock(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };

        try {
            const validatedQuery = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            var category = await findFlashCardCategory(query);
            if (!category) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {
                console.log(category.status)
                let statusChanged = category.status == 'ACTIVE' ? status.BLOCK : status.ACTIVE

                let result = await findandUpdateCategory({ _id: req.query._id }, { status: statusChanged })
                return res.json(new response(result, `Category ${statusChanged} succesfully`));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }



    /**
    * @swagger
    * /flashCard/addFlashcardSubCategory:
    *   post:
    *     tags:
    *       - FlashCards
    *     description: flashCards
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: subCategoryName
    *         description: subCategoryName
    *         in: formData
    *         required: true
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
    async addFlashcardSubCategory(req, res, next) {
        const validationSchema = {
            subCategoryName: Joi.string().required()
        };
        const queryValidationSchema = {
            categoryId: Joi.string().required()
        };
        try {
            const validatedBody = await Joi.validate(req.body, validationSchema);
            const validatedQueryBody = await Joi.validate(req.query, queryValidationSchema);
            let query = { subCategoryName: req.body.subCategoryName, categoryId: req.query.categoryId, status: { $ne: 'DELETE' } }
            var category = await findFlashCardSubCategory(query);
            console.log(category)
            if (category) {
                throw apiError.conflict(responseMessage.ALREADY_EXITS);

            }
            else {
                validatedBody.categoryId = req.query.categoryId
                var result = await createFlashCardSubCategory(validatedBody)
                return res.json(new response(result, responseMessage.ADD_CATEGORY));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }



    /**
     * @swagger
     * /flashCard/flashcardSubCategoryList:
     *   get:
     *     tags:
     *       - FlashCards
     *     description: flashCards
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
    async flashcardSubCategoryList(req, res, next) {

        try {

            let query = { status: { $ne: status.DELETE } }
            let appen =  await queryHandler.queryWithoutPagination(req.query)

            let finalQuery = {
                ...query,
                ...appen
            }


            var categoryList = await findFlashCardSubCategoryList(finalQuery);
            if (!categoryList) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {

                return res.json(new response(categoryList, responseMessage.DATA_FOUND));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }



    /**
 * @swagger
 * /flashCard/flashcardSubCategoryView:
 *   get:
*     tags:
 *       - FlashCards
 *     description: flashCards
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: subcategoryId
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
    async flashcardSubCategoryView(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };
        try {
            const validatedQuery = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            var category = await findFlashCardSubCategory(query);
            if (!category) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {

                return res.json(new response(category, responseMessage.DATA_FOUND));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }



    /**
 * @swagger
 * /flashCard/flashcardSubCategoryEdit:
 *   post:
     *     tags:
     *       - FlashCards
     *     description: flashCards
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
    async flashcardSubCategoryEdit(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };
        const validationBodySchema = {
            categoryName: Joi.string().required()
        };

        try {
            const validatedQuery = await Joi.validate(req.query, validationSchema);
            const validatedBody = await Joi.validate(req.body, validationBodySchema);
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            var category = await findFlashCardSubCategory(query);
            if (!category) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {
                let result = await findandUpdateFlashCardSubCategory({ _id: req.query._id }, validatedBody)
                return res.json(new response(result, responseMessage.DATA_FOUND));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }




    /**
* @swagger
* /flashCard/flashcardSubCategoryDelete:
*   delete:
     *     tags:
     *       - FlashCards
     *     description: flashCards
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
    async flashcardSubCategoryDelete(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };

        try {
            const validatedQuery = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            var category = await findFlashCardSubCategory(query);
            if (!category) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {
                let result = await findandUpdateFlashCardSubCategory({ _id: req.query._id }, { status: status.DELETE })
                return res.json(new response(result, responseMessage.DELETE_SUCCESS));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }


    /**
* @swagger
* /flashCard/flashcardSubCategoryBlockUnblock:
*   put:
     *     tags:
     *       - FlashCards
     *     description: flashCards
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
    async flashcardSubCategoryBlockUnblock(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };

        try {
            const validatedQuery = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: 'DELETE' } }
            var category = await findFlashCardSubCategory(query);
            if (!category) {
                throw apiError.conflict(responseMessage.NOT_FOUND);

            }
            else {
                console.log(category.status)
                let statusChanged = category.status == 'ACTIVE' ? status.BLOCK : status.ACTIVE

                let result = await findandUpdateFlashCardSubCategory({ _id: req.query._id }, { status: statusChanged })
                return res.json(new response(result, `Category ${statusChanged} succesfully`));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }


    /**
    * @swagger
    * /flashCard/addFlashcard:
    *   post:
    *     tags:
    *       - FlashCards
    *     description: flashCards
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: addFlashcard
    *         description: addFlashcard
    *         in: body
    *         required: true
    *         schema:
    *           $ref: '#/definitions/addFlashcard'
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
    async addFlashcard(req, res, next) {
        const validationSchema = {
            categoryId: Joi.string().required(),
            subCategoryId: Joi.string().required(),
            title: Joi.string().required(),
            authorName: Joi.string().required(),
            subject: Joi.string().required(),
            flashCard: Joi.array().optional()

        };

        try {
            const validatedBody = await Joi.validate(req.body);
            var category = await findFlashCardCategory({ _id: req.body.categoryId, status: { $ne: 'DELETE' } });
            var subCategory = await findFlashCardSubCategory({ _id: req.body.subCategoryId, status: { $ne: 'DELETE' } });
            var flashcard = await findFlashCard({ title: req.body.title, categoryId: req.body.categoryId, subCategoryId: req.body.subCategoryId, status: { $ne: 'DELETE' } });
            if (!category) {
                throw apiError.conflict(`Category ${responseMessage.NOT_FOUND}`);
            }
            else if (!subCategory) {
                throw apiError.conflict(`Sub-Category ${responseMessage.NOT_FOUND}`);
            }
            else if (flashcard) {
                throw apiError.conflict(responseMessage.ALREADY_EXITS);
            }
            else {
                var result = await createFlashCard(validatedBody)
                return res.json(new response(result, responseMessage.ADD_SUCCESS));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }


    /**
     * @swagger
     * /flashCard/viewFlashcard:
     *   get:
     *     tags:
     *       - FlashCards
     *     description: flashCards
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
    async viewFlashcard(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required(),

        };

        try {
            const validatedBody = await Joi.validate(req.query, validationSchema);
            var flashcard = await findFlashCard({ _id: req.query._id, status: { $ne: 'DELETE' } });
            if (!flashcard) {
                throw apiError.conflict(`Flashcard ${responseMessage.NOT_FOUND}`);
            }

            else {
                return res.json(new response(flashcard, responseMessage.ADD_SUCCESS));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }



    /**
   * @swagger
   * /flashCard/editFlashcard:
   *   post:
   *     tags:
   *       - FlashCards
   *     description: flashCards
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: editFlashcard
   *         description: editFlashcard
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/editFlashcard'
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
    async editFlashcard(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required(),
            categoryId: Joi.string().required(),
            subCategoryId: Joi.string().required(),
            title: Joi.string().required(),
            authorName: Joi.string().required(),
            subject: Joi.string().required(),
            flashCard: Joi.array().optional()

        };

        try {
            const validatedBody = await Joi.validate(req.body);
            var category = await findFlashCardCategory({ _id: req.body.categoryId, status: { $ne: 'DELETE' } });
            var subCategory = await findFlashCardSubCategory({ _id: req.body.subCategoryId, status: { $ne: 'DELETE' } });
            var flashcard = await findFlashCard({ title: req.body.title, categoryId: req.body.categoryId, subCategoryId: req.body.subCategoryId, status: { $ne: 'DELETE' } });
            if (!category) {
                throw apiError.conflict(`Category ${responseMessage.NOT_FOUND}`);
            }
            else if (!subCategory) {
                throw apiError.conflict(`Sub-Category ${responseMessage.NOT_FOUND}`);
            }
            else if (flashcard) {
                throw apiError.conflict(responseMessage.ALREADY_EXITS);
            }
            else {
                var result = await findandUpdateFlashCard({ _id: req.body._id }, validatedBody)
                return res.json(new response(result, responseMessage.ADD_SUCCESS));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }



    /**
   * @swagger
   * /flashCard/deleteFlashcard:
   *   delete:
   *     tags:
   *       - FlashCards
   *     description: flashCards
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
    async deleteFlashcard(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required(),
        };

        try {
            const validatedBody = await Joi.validate(req.query, validationSchema);
            var flashcard = await findFlashCard({ _id: req.query._id, status: { $ne: 'DELETE' } });
            if (!flashcard) {
                throw apiError.conflict(`Flashcard ${responseMessage.NOT_FOUND}`);
            }
            else {
                var result = await findandUpdateFlashCard({ _id: req.query._id }, { status: status.DELETE })
                return res.json(new response(result, responseMessage.DELETE_SUCCESS));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }



    /**
 * @swagger
 * /flashCard/blockUnblockFlashcard:
 *   put:
 *     tags:
 *       - FlashCards
 *     description: flashCards
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
    async blockUnblockFlashcard(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required(),
        };

        try {
            console.log("error ==========> 79", req.query)
            const validatedBody = await Joi.validate(req.query, validationSchema);
            var flashcard = await findFlashCard({ _id: req.query._id, status: { $ne: 'DELETE' } });
            if (!flashcard) {
                throw apiError.conflict(`Flashcard ${responseMessage.NOT_FOUND}`);
            }
            else {

                let statusChanged = flashcard.status == 'ACTIVE' ? status.BLOCK : status.ACTIVE
                var result = await findandUpdateFlashCard({ _id: req.query._id }, { status: statusChanged })
                return res.json(new response(result, `Flashcard ${statusChanged} Successfully`));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }




    /**
 * @swagger
 * /flashCard/listFlashcard:
 *   get:
 *     tags:
 *       - FlashCards
 *     description: flashCards
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
     async listFlashcard(req, res, next) {
       

        try {
            
            let query =  {status : {$ne : status.DELETE}}
            let appen =  await queryHandler.queryWithoutPagination(req.query)

            let finalQuery = {
                ...query,
                ...appen
            }

            var flashcard = await findFlashCardList(finalQuery);
            if (!flashcard) {
                throw apiError.conflict(`Flashcard ${responseMessage.NOT_FOUND}`);
            }
            else {
                return res.json(new response(flashcard, responseMessage.DATA_FOUND));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }
}

export default new flashCard()