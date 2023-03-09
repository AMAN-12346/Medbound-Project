import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";
import upload from '../../../../helper/uploadHandler';


export default Express.Router()

.post('/addFlashcardCategory', controller.addFlashcardCategory)
.get('/flashcardCategoryList',controller.flashcardCategoryList)
.get('/flashcardCategoryView',controller.flashcardCategoryView)
.post('/flashcardCategoryEdit',controller.flashcardCategoryEdit)
.delete('/flashcardCategoryDelete',controller.flashcardCategoryDelete)
.put('/flashcardCategoryBlockUnblock',controller.flashcardCategoryBlockUnblock)



.post('/addFlashcardSubCategory', controller.addFlashcardSubCategory)
.get('/flashcardSubCategoryList',controller.flashcardSubCategoryList)
.get('/flashcardSubCategoryView',controller.flashcardSubCategoryView)
.post('/flashcardSubCategoryEdit',controller.flashcardSubCategoryEdit)
.delete('/flashcardSubCategoryDelete',controller.flashcardSubCategoryDelete)
.put('/flashcardSubCategoryBlockUnblock',controller.flashcardSubCategoryBlockUnblock)


.post('/addFlashcard',controller.addFlashcard)
.get('/viewFlashcard',controller.viewFlashcard)
.post('/editFlashcard',controller.editFlashcard)
.delete('/deleteFlashcard',controller.deleteFlashcard)
.put('/blockUnblockFlashcard',controller.blockUnblockFlashcard)
.get('/listFlashcard',controller.listFlashcard)