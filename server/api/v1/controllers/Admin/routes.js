import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from "../../../../helper/uploadHandler";

export default Express.Router()
  .put("/forgotPassword", controller.forgotPassword)
  .post("/verifyOTP", controller.verifyOTP)
  .post("/resendOTP", controller.resendOTP)
  .put("/resetPassword/:token", controller.resetPassword)
  .post("/userLogin", controller.userLogin)

  .use(auth.verifyToken)
  .get("/getProfile", controller.getProfile)
  .put("/changePassword", controller.changePassword)
  .get("/dashboard", controller.dashboard);
