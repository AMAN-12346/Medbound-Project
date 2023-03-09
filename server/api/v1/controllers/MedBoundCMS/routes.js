import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from '../../../../helper/uploadHandler';


export default Express.Router()

.get('/medBoundCmsList', controller.medBoundCmsList)
.get('/medBoundCmsView',controller.medBoundCmsView)
// .get('/blogView',controller.blogView)
.put('/updateAbout',controller.updateAbout)
.put('/updateCampus',controller.updateCampus)
// .delete('/blogDelete',controller.blogDelete)
// .put('/blogBlockUnblock',controller.blogBlockUnblock)




