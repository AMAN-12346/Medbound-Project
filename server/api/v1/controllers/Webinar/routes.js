import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from "../../../../helper/uploadHandler";

export default Express.Router()
  .get("/listWebinar", controller.listWebinar)
  .post("/viewWebinar", controller.viewWebinar)

  .use(upload.uploadFile)

  .use(auth.verifyToken)
  .post("/addWebinar", controller.addWebinar)
  .put("/editWebinar", controller.editWebinar);
