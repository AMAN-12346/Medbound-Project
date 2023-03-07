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
const { userCheck, paginateSearch, insertManyUser, createAddress, checkUserExists, emailMobileExist, createUser, findUser, updateUser, updateUserById, checkSocialLogin } = userServices;

export class adminController {

    /**
     * @swagger
     * /admin/verifyOTP:
     *   post:
     *     tags:
     *       - ADMIN
     *     description: verifyOTP
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: verifyOTP
     *         description: verifyOTP
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/verifyOTP'
     *     responses:
     *       200:
     *         description: OTP verified successfully.
     *       404:
     *         description: User not found..
     *       400:
     *         description: OTP expired. / Incorrect OTP.
     *       501:
     *         description: Something went wrong.
     *       500:
     *         description: Internal server error.
     */
    async verifyOTP(req, res, next) {
        var validationSchema = {
            email: Joi.string().required(),
            otp: Joi.string().required()
        };
        try {
            var validatedBody = await Joi.validate(req.body, validationSchema);
            const { email, otp } = validatedBody;
            var userResult = await findUser({ $or: [{ email: email }, { mobileNumber: email }] })
            if (!userResult) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }
            else {
                if (Date.now() > userResult.otpExpireTime) {
                    throw apiError.badRequest(responseMessage.OTP_EXPIRED);
                }
                if (userResult.otp != otp) {
                    throw apiError.badRequest(responseMessage.INCORRECT_OTP);
                }
                var updateResult = await updateUser({ _id: userResult._id }, { otpVerified: true, isReset: true })
                var token = await commonFunction.getToken({ _id: updateResult._id, email: updateResult.email, userType: updateResult.userType });
                var obj = {
                    _id: updateResult._id,
                    firstName: updateResult.firstName,
                    email: updateResult.email,
                    countryCode: updateResult.countryCode,
                    mobileNumber: updateResult.mobileNumber,
                    token: token
                }
                return res.json(new response(obj, responseMessage.OTP_VERIFY));

            }
        }
        catch (error) {
            return next(error);
        }
    }

    /**
     * @swagger
     * /admin/resendOTP:
     *   post:
     *     tags:
     *       - ADMIN
     *     description: resendOTP
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: resendOTP
     *         description: resendOTP
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/resendOTP'
     *     responses:
     *       200:
     *         description: OTP has been sent successfully on register email.
     *       404:
     *         description: User not found.
     *       501:
     *         description: Something went wrong.
     *       500:
     *         description: Internal server error.
     */
    async resendOTP(req, res, next) {
        var validationSchema = {
            email: Joi.string().required()
        };
        try {
            var validatedBody = await Joi.validate(req.body, validationSchema);
            const { email, otpExpireTime, otp } = validatedBody;
            var userResult = await findUser({ $or: [{ email: email }, { mobileNumber: email }] })
            if (!userResult) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            } else {
                let otp = await commonFunction.getOTP();
                let otpExpireTime = Date.now() + 180000;
                if (userResult.email == email) {
                    await commonFunction.sendEmailOtp(email, otp)
                }
                if (userResult.mobileNumber == email) {
                    await commonFunction.sendSms(userResult.countryCode + userResult.mobileNumber, otp);
                }
                var updateResult = await updateUser({ _id: userResult._id }, { otp: otp, otpExpireTime: otpExpireTime, otpVerified: false });
                return res.json(new response(updateResult, responseMessage.OTP_SEND));

            }
        }
        catch (error) {
            return next(error);
        }
    }

    /**
     * @swagger
     * /admin/forgotPassword:
     *   post:
     *     tags:
     *       - ADMIN
     *     description: forgotPassword
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: forgotPassword
     *         description: forgotPassword
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/forgotPassword'
     *     responses:
     *       200:
     *         description: OTP has been sent successfully on register email.
     *       404:
     *         description: User not found.
     *       501:
     *         description: Something went wrong.
     *       500:
     *         description: Internal server error.
     */
    async forgotPassword(req, res, next) {
        var validationSchema = {
            email: Joi.string().required()
        };
        try {
            var validatedBody = await Joi.validate(req.body, validationSchema);
            const { email } = validatedBody;
            var userResult = await findUser({ $or: [{ email: email }, { mobileNumber: email }] })
            if (!userResult) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            } else {
                let otp = await commonFunction.getOTP();
                let otpExpireTime = Date.now() + 180000;
                if (userResult.email == email) {
                    await commonFunction.sendEmailOtp(email, otp)
                }
                if (userResult.mobileNumber == email) {
                    await commonFunction.sendSms(userResult.countryCode + userResult.mobileNumber, otp);
                }
                var updateResult = await updateUser({ _id: userResult._id }, { otp: otp, otpExpireTime: otpExpireTime, isReset: false });
                return res.json(new response(updateResult, responseMessage.OTP_SEND));
            }
        }
        catch (error) {
            return next(error);
        }
    }

    /**
     * @swagger
     * /admin/resetPassword/{token}:
     *   put:
     *     tags:
     *       - ADMIN
     *     description: resetPassword
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: token
     *         description: token
     *         in: path
     *         required: true
     *       - name: resetPassword
     *         description: resetPassword
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/resetPassword'
     *     responses:
     *       200:
     *         description: Password has been changed successfully.
     *       404:
     *         description: User not found.
     *       501:
     *         description: Something went wrong.
     *       500:
     *         description: Internal server error.
     */
    async resetPassword(req, res, next) {
        var validationSchema = {
            newPassword: Joi.string().required()
        };
        try {
            var validatedBody = await Joi.validate(req.body, validationSchema);
            const { token } = req.params;
            var result = await jwt.verify(token, config.get('jwtsecret'))
            var userResult = await findUser({ _id: result._id, userType: { $in: [userType.ADMIN] } })
            if (!userResult) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }
            var updateResult = await updateUser({ _id: userResult._id }, { isReset: true, password: bcrypt.hashSync(validatedBody.newPassword) })
            return res.json(new response(updateResult, responseMessage.PWD_CHANGED));

        }
        catch (error) {
            return next(error);
        }
    }
    /**
     * @swagger
     * /admin/changePassword:
     *   put:
     *     tags:
     *       - ADMIN
     *     description: changePassword
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: token
     *         description: token
     *         in: header
     *         required: true
     *       - name: oldPassword
     *         description: oldPassword
     *         in: formData
     *         required: true
     *       - name: newPassword
     *         description: newPassword
     *         in: formData
     *         required: true
     *     responses:
     *       200:
     *         description: Password has been changed successfully.
     *       400:
     *         description: Invalid password.
     *       404:
     *         description: User not found.
     *       501:
     *         description: Something went wrong.
     *       500:
     *         description: Internal server error.
     */
    async changePassword(req, res, next) {
        const validationSchema = {
            oldPassword: Joi.string().required(),
            newPassword: Joi.string().required()
        };
        try {
            let validatedBody = await Joi.validate(req.body, validationSchema);
            let userResult = await findUser({ _id: req.userId, userType: { $in: [userType.ADMIN] } });
            if (!userResult) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }
            if (bcrypt.compareSync(validatedBody.oldPassword, userResult.password)) {
                var updated = await updateUser({ _id: userResult._id }, { password: bcrypt.hashSync(validatedBody.newPassword) });
                return res.json(new response(updated, responseMessage.PWD_CHANGED));
            }
            throw apiError.badRequest(responseMessage.PWD_NOT_MATCH);
        } catch (error) {
            return next(error);
        }
    }

    /**
     * @swagger
     * /admin/userLogin:
     *   post:
     *     tags:
     *       - ADMIN
     *     description: login
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
    async userLogin(req, res, next) {
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
            if (userResult.otpVerified == false || userResult.isReset == false) {
                throw apiError.invalid(responseMessage.INCORRECT_LOGIN);
            }
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
      * /admin/getProfile:
      *   get:
      *     tags:
      *       - ADMIN
      *     description: getProfile
      *     produces:
      *       - application/json
      *     parameters:
      *       - name: token
      *         description: User token
      *         in: header
      *         required: true
      *     responses:
      *       200:
      *         description: Profile details found successfully.
      *       404:
      *         description: User not found.
      *       501:
      *         description: Something went wrong.
      *       500:
      *         description: Internal server error.
      */
    async getProfile(req, res, next) {
        try {
            let userResult = await findUser({ _id: req.userId, userType: { $in: [userType.ADMIN, userType.EXPERT, userType.AGENT] } });
            if (!userResult) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }
            return res.json(new response(userResult, responseMessage.USER_DETAILS));
        } catch (error) {
            return next(error);
        }
    }
}

export default new adminController()