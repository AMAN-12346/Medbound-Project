import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from '../../../../helper/uploadHandler';


export default Express.Router()

.post('/verifyOTP', controller.verifyOTP)
.post('/resendOTP', controller.resendOTP)

.post('/forgotPassword', controller.forgotPassword)
.put('/resetPassword/:token', controller.resetPassword)
.post('/userLogin', controller.userLogin)

.use(auth.verifyToken)
.get('/getProfile', controller.getProfile)
.put('/changePassword', controller.changePassword)
.get('/dashboard', controller.dashboard)