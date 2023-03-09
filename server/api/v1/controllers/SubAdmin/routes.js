import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from '../../../../helper/uploadHandler';


export default Express.Router()

.post('/addSubAdmin', controller.addSubAdmin)
.get('/subAdminList', controller.subAdminList)
.get('/viewSubAdmin', controller.viewSubAdmin)
.put('/editSubAdmin', controller.editSubAdmin)
.delete('/deleteSubAdmin', controller.deleteSubAdmin)
.put('/blockUnblockSubAdmin', controller.blockUnblockSubAdmin)
.use(auth.verifyToken)





