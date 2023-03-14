import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from "../../../../helper/uploadHandler";

export default Express.Router()
  .use(auth.verifyToken)
  .get("/listExamModule", controller.listExamModule)
  .post("/AddExamModule", controller.AddExamModule)
  .put("/EditExamModule", controller.EditExamModule)
  .put("/BlockExamModeule", controller.BlockExamModeule)
  .put("/DeleteExamModeule", controller.DeleteExamModeule)

