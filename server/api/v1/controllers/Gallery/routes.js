import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from "../../../../helper/uploadHandler";

export default Express.Router()
  .get("/listGallery", controller.listGallery)
  .post("/viewGallery", controller.viewGallery)

  .use(upload.uploadFile)

  .post("/addGallery", controller.addGallery)
  .use(auth.verifyToken)
  .put("/editGallery", controller.editGallery);
