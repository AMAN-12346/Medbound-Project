import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from "../../../../helper/uploadHandler";

export default Express.Router()

.get("/listFroum", controller.listFroum)

  .use(upload.uploadFile)

  .use(auth.verifyToken)
  .post("/addFroum", controller.addFroum)
  .put("/editFroum", controller.editFroum)

  .post("/addClub", controller.addClub)
  .put("/editClub", controller.editClub);
