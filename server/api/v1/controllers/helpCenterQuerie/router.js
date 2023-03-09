import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from '../../../../helper/uploadHandler';


export default Express.Router()

.post('/addhelpCenterQuery', controller.addhelpCenterQuery)

.get('/viewHelpCenterQuery', controller.viewHelpCenterQuery)
.get('/listHelpCenterQuery', controller.listHelpCenterQuery)

.use(auth.verifyToken)





