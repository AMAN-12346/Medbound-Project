import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";

export default Express.Router()

  .post("/addStaticContent", controller.addStaticContent)
  .get("/staticContentList", controller.staticContentList)
  .post("/addTestimonial", controller.addTestimonial)
  .get("/viewTestimonial/:_id", controller.viewTestimonial)
  .get("/viewStory", controller.viewStory)
  .post("/addStory", controller.addStory)
  .post("/addFAQ", controller.addFAQ)
  .get("/viewFAQ/:_id", controller.viewFAQ)
  .get("/faqList", controller.faqList)



  .get("/listFAQCategory", controller.listFAQCategory)



  .use(auth.verifyToken)
  .put("/editStaticContent", controller.editStaticContent)
  .put("/editFAQ", controller.editFAQ)
  .delete("/deleteFAQ", controller.deleteFAQ)
  .delete("/deleteStaticContent", controller.deleteStaticContent)
  .put("/editTestimonial", controller.editTestimonial)

  .put("/editStory", controller.editStory)
  .post("/addFAQCategory", controller.addFAQCategory)
  .put("/editFAQCategory", controller.editFAQCategory)
  .delete("/deleteFAQCategory", controller.deleteFAQCategory)
  .put("/blockUnblockFAQCategory", controller.blockUnblockFAQCategory)

  .put("/editStory", controller.editStory);

