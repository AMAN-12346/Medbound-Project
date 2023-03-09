import Express from "express"
import controller from "../Event/controller";
import auth from "../../../../helper/auth";
import upload from '../../../../helper/uploadHandler';


export default Express.Router()

.post("/viewevent", controller.viewevent)

.use(auth.verifyToken)
.use(upload.uploadFile)
.post('/addevent', controller.addevent)
.put('/editevent', controller.editevent)






