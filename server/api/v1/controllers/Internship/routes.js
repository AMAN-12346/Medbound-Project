import Express from "express";
import controller from "../Internship/controller";
import auth from "../../../../helper/auth";
import upload from '../../../../helper/uploadHandler';


export default Express.Router()
.post("/viewinternship", controller.viewinternship)
.get("/listInternship", controller.listInternship)



.use(auth.verifyToken) 
.use(upload.uploadFile)
.post('/addinternship', controller.addinternship)
.put('/editinternship', controller.editinternship)


