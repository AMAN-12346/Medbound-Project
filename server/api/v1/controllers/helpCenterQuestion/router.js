import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from '../../../../helper/uploadHandler';


export default Express.Router()

.post('/addHelpCenterQuestion', controller.addHelpCenterQuestion)
.put('/editHelpCenterQuestion', controller.editHelpCenterQuestion)
.delete('/deleteHelpCenterQuestion', controller.deleteHelpCenterQuestion)
.put('/blockUnblockHelpCenterQuestion', controller.blockUnblockHelpCenterQuestion)
.get('/viewHelpCenterQuestion', controller.viewHelpCenterQuestion)
.use(auth.verifyToken)
.get('/listHelpCenterQuestion', controller.listHelpCenterQuestion)






