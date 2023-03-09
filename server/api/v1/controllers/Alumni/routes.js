import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from "../../../../helper/uploadHandler";

export default Express.Router()

  .get("/listAlumini", controller.listAlumini)
  .post("/viewAlumini", controller.viewAlumini)

  .use(auth.verifyToken)
  .use(upload.uploadFile)
  .post("/addAlumini", controller.addAlumini)
  .put("/editAlumini", controller.editAlumini);
