import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from "../../../../helper/uploadHandler";

export default Express.Router()

  .post("/viewMentor", controller.viewMentor)
  
  .use(auth.verifyToken)
  .use(upload.uploadFile)
  .post("/addMentor", controller.addMentor)
  .put("/editAlumini", controller.editMentor);
