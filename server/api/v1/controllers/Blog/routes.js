import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from '../../../../helper/uploadHandler';


export default Express.Router()

.post('/addBlog', controller.addBlog)
.get('/blogList',controller.blogList)
.get('/blogView',controller.blogView)
.put('/blogEdit',controller.blogEdit)
.delete('/blogDelete',controller.blogDelete)
.put('/blogBlockUnblock',controller.blogBlockUnblock)




