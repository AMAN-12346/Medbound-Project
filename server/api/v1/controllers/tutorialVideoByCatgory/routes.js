import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from '../../../../helper/uploadHandler';


export default Express.Router()

.post('/addTutorialVideo', controller.addTutorialVideo)
.get('/tutorialVideoList',controller.tutorialVideoList)
.get('/tutorialVideoView',controller.tutorialVideoView)
.get('/tutorialVideoByCategoryId',controller.tutorialVideoByCategoryId)
.post('/tutorialVideoEdit',controller.tutorialVideoEdit)
.delete('/tutorialVideoDelete',controller.tutorialVideoDelete)
.put('/tutorialVideoBlockUnblock',controller.tutorialVideoBlockUnblock)
