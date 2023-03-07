import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from '../../../../helper/uploadHandler';


export default Express.Router()

.get('/medBoundTimesList', controller.medBoundTimesList)
.get('/medBoundTimesView',controller.medBoundTimesView)
// .get('/blogView',controller.blogView)
.put('/updateAbout',controller.updateAbout)
.put('/updateCareer',controller.updateCareer)
.put('/updateInternship',controller.updateInternship)
// .delete('/blogDelete',controller.blogDelete)
// .put('/blogBlockUnblock',controller.blogBlockUnblock)




