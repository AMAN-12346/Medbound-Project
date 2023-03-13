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
import { userServices } from '../../services/user';
const { userCheck, paginateSearch, findSub_Admin, insertManyUser, createAddress, checkUserExists, emailMobileExist, createUser, findUser, updateUser, updateUserById, checkSocialLogin } = userServices;


export class subAdminController {


    /**
 * @swagger
 * /subAdmin/addSubAdmin:
 *   post:
 *     tags:
 *       - SubAdmin
 *     description: addSubAdmin
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: addSubAdmin
 *         description: addSubAdmin
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/addSubAdmin'
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
    async addSubAdmin(req, res, next) {
        const validationSchema = {
            name: Joi.string().required(),
            email: Joi.string().required(),
            mobileNumber: Joi.string().required(),
            password: Joi.string().required(),
            permission: Joi.object().optional()
        };
        try {
            const validatedBody = await Joi.validate(req.body, validationSchema);
            const { mobileNumber, email } = validatedBody
            var userInfo = await checkUserExists(mobileNumber, email);
            if (userInfo) {
                if (userInfo.mobileNumber == mobileNumber) { throw apiError.conflict(responseMessage.MOBILE_EXIST); }
                throw apiError.conflict(responseMessage.EMAIL_EXIST);
            }
            validatedBody.userType = userType.SUB_ADMIN;
            validatedBody.status = status.ACTIVE
            validatedBody.otp = commonFunction.getOTP();
            validatedBody.otpExpireTime = Date.now() + 180000;
            validatedBody.password = bcrypt.hashSync(validatedBody.password);
            let result = await createUser(validatedBody)
            return res.json(new response(result, responseMessage.ADD_SUCCESS));
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }




    /**
     * @swagger
     * /subAdmin/SubAdminLogin:
     *   post:
     *     tags:
     *       - SubAdmin
     *     description: SubAdminLogin
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: email
     *         description: email/mobilenumber
     *         in: formData
     *         required: true
     *       - name: password
     *         description: password
     *         in: formData
     *         required: true
     *     responses:
     *       200:
     *         description: Login successfully.
     *       402:
     *         description: Incorrect login credential provided.
     *       404:
     *         description: User not found.
     *       501:
     *         description: Something went wrong.
     *       500:
     *         description: Internal server error.
     */
    async SubAdminLogin(req, res, next) {
        let validationSchema = {
            email: Joi.string().optional(),
            password: Joi.string().optional(),
        }
        try {
            let validatedBody = await Joi.validate(req.body, validationSchema);
            let userResult = await findUser({ $or: [{ email: validatedBody.email }, { mobileNumber: validatedBody.email }], status: status.ACTIVE });
            if (!userResult) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }
            // if (userResult.otpVerified == false || userResult.isReset == false) {
            //     throw apiError.invalid(responseMessage.INCORRECT_LOGIN);
            // }
            if (!bcrypt.compareSync(validatedBody.password, userResult.password)) {
                throw apiError.invalid(responseMessage.INCORRECT_LOGIN);
            }
            let token = await commonFunction.getToken({ _id: userResult._id, email: userResult.email, userType: userResult.userType });
            let obj = {
                _id: userResult._id,
                email: userResult.email,
                userType: userResult.userType,
                permission: userResult.permission,
                token: token,

            }
            return res.json(new response(obj, responseMessage.LOGIN));
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }



    /**
     * @swagger
     * /subAdmin/subAdminList:
     *   get:
     *     tags:
     *       - SubAdmin
     *     description: SubAdmin
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
    async subAdminList(req, res, next) {

        try {

            let query = { status: { $ne: status.DELETE } }
            var list = await findList(query);
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
 * /subAdmin/viewSubAdmin/{SubAdminId}:
 *   get:
 *     tags:
 *       - SubAdmin
 *     description: SubAdmin
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: SubAdminId
 *         description: _id
 *         in: path
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
    async viewSubAdmin(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required()
        };
        try {
            const validatedBody = await Joi.validate(req.params, validationSchema);
            const { SubAdminId } = validatedBody;
            let query = { _id: SubAdminId, status: status.ACTIVE }
            let data = await findSub_Admin(query)
            if (!data) {
                throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
            }
            return res.json(new response(data, responseMessage.DATA_FOUND));

        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }



    /**
 * @swagger
 * /subAdmin/editSubAdmin:
 *   put:
 *     tags:
 *       - SubAdmin
 *     description: SubAdmin
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
 *       - name: subAdmin
 *         description: subAdmin
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/subAdmin'
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
    async editSubAdmin(req, res, next) {
        const validationSchema = {
            name: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            permission: Joi.object().optional()

        };
        try {
            let currentEmail = req.body.email
            const validatedBody = await Joi.validate(req.body, validationSchema);
            let query = { _id: req.query._id, status: { $ne: status.DELETE } }
            let data = await find(query)
            let findEmail = await find({ email: currentEmail })
            if (data && findEmail && data.email != currentEmail) {

                throw apiError.conflict(responseMessage.ALREADY_EXITS);

            }
            else {

                let result = await findandUpdate({ _id: req.query._id }, validatedBody)

                return res.json(new response(result, responseMessage.UPDATE_SUCCESS));

            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }



    /**
 * @swagger
 * /subAdmin/deleteSubAdmin:
 *   delete:
 *     tags:
 *       - SubAdmin
 *     description: SubAdmin
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
    async deleteSubAdmin(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required(),


        };
        try {
            const validatedBody = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: status.DELETE } }
            let data = await find(query)
            if (!data) {
                throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
            }
            else {
                let result = await findandUpdate({ _id: req.query._id }, { status: status.DELETE })
                return res.json(new response(result, responseMessage.DELETE_SUCCESS));
            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }


    /**
* @swagger
* /subAdmin/blockUnblockSubAdmin:
*   put:
*     tags:
*       - SubAdmin
*     description: SubAdmin
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
    async blockUnblockSubAdmin(req, res, next) {
        const validationSchema = {
            _id: Joi.string().required(),


        };
        try {
            const validatedBody = await Joi.validate(req.query, validationSchema);
            let query = { _id: req.query._id, status: { $ne: status.DELETE } }
            let data = await find(query)
            if (!data) {
                throw apiError.conflict(responseMessage.DATA_NOT_FOUND);
            }
            else {
                let changeStatus = data.status == status.ACTIVE ? status.BLOCK : status.ACTIVE
                let result = await findandUpdate({ _id: req.query._id }, { status: changeStatus })
                return res.json(new response(result, `Admin ${changeStatus.toLocaleLowerCase()} successfully`));
            }
        } catch (error) {
            console.log("error ==========> 79", error)
            return next(error);
        }
    }

}

export default new subAdminController()