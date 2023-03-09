import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";

export default Express.Router()

  .post("/addStaticContent", controller.addStaticContent)
  .put("/editStaticContent", controller.editStaticContent)
  .get("/staticContentList", controller.staticContentList)
  .post("/addTestimonial", controller.addTestimonial)
  .put("/static", controller.editStaticContent)
  .get("/static", controller.staticContentList)
  .post("/addFAQ", controller.addFAQ)
  .get("/viewFAQ/:_id", controller.viewFAQ)
  .get("/faqList", controller.faqList)

  .use(auth.verifyToken)
  .put("/editFAQ", controller.editFAQ)
  .delete("/deleteFAQ", controller.deleteFAQ)
  .delete("/deleteStaticContent", controller.deleteStaticContent)
  .put("/editTestimonial", controller.editTestimonial)

