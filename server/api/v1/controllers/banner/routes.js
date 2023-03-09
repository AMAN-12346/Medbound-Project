import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from "../../../../helper/uploadHandler";

export default Express.Router()
  .post("/viewBanner", controller.viewBanner)

  .use(auth.verifyToken)
  .use(upload.uploadFile)
  .post("/addBanner", controller.addBanner)
  .put("/editBanner", controller.editBanner);
