import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth";

export default Express.Router()

  .post("/static", controller.addStaticContent)
  .put("/static", controller.editStaticContent)
  .get("/static", controller.staticContentList)

  .post("/faq", controller.addFAQ)
  .get("/faq/:_id", controller.viewFAQ)
  .get("/faq", controller.faqList)

  .use(auth.verifyToken)
  .put("/faq", controller.editFAQ)
  .delete("/faq", controller.deleteFAQ)
  .delete("/static", controller.deleteStaticContent);
