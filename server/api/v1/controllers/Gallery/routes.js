import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from "../../../../helper/uploadHandler";

export default Express.Router()
  .use(upload.uploadFile)

  .use(auth.verifyToken)