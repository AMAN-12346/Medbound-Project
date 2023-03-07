import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from '../../../../helper/uploadHandler';


export default Express.Router()

.post('/addTutorialCategory', controller.addTutorialCategory)
.get('/tutorialCategoryList',controller.tutorialCategoryList)
.get('/tutorialCategoryView',controller.tutorialCategoryView)
.post('/tutorialCategoryEdit',controller.tutorialCategoryEdit)
.delete('/tutorialCategoryDelete',controller.tutorialCategoryDelete)
.put('/tutorialCategoryBlockUnblock',controller.tutorialCategoryBlockUnblock)




