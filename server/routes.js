//v7 imports
import user from "./api/v1/controllers/user/routes";
import admin from "./api/v1/controllers/Admin/routes";

import tutorial from "./api/v1/controllers/TutorialVideo/routes";
import tutorialVideoByCategory from "./api/v1/controllers/tutorialVideoByCatgory/routes";
import flashCards from "./api/v1/controllers/flashCards/routes";

import forum from "./api/v1/controllers/ForumAndSocial_Clubs/routes";
import club from "./api/v1/controllers/ForumAndSocial_Clubs/routes";
import statics from "./api/v1/controllers/faq/routes";
import faq from "./api/v1/controllers/faq/routes";
import blog from "./api/v1/controllers/Blog/routes";
import medBound from "./api/v1/controllers/MedBoundCMS/routes";
import medBoundTimes from "./api/v1/controllers/MedBoundTimes/routes";

import subAdmin from "./api/v1/controllers/SubAdmin/routes";
import helpCenterQuestion from "./api/v1/controllers/helpCenterQuestion/router";
import helpCenterQuerie from "./api/v1/controllers/helpCenterQuerie/router";

import gallery from "./api/v1/controllers/Gallery/routes";
import alumini from "./api/v1/controllers/Alumni/routes";

import Banner from "./api/v1/controllers/banner/routes";
import Testimonial from "./api/v1/controllers/faq/routes"
import webinar from "./api/v1/controllers/Webinar/routes"
import mentor from "./api/v1/controllers/Mentor/routes"
import internship from "./api/v1/controllers/Internship/routes"
import event from "./api/v1/controllers/Event/routes";
import exam from "./api/v1/controllers/ExamModule/routes"




/**
 *
 *
 * @export
 * @param {any} app
 */

export default function routes(app) {
  app.use("/api/v1/user", user);
  app.use("/api/v1/admin", admin);
  app.use("/api/v1/forum", forum);
  app.use("/api/v1/club", club);

  // app.use("/api/v1/user", user); 
  // app.use("/api/v1/admin", admin); 

  app.use("/api/v1/tutorialVideo", tutorial);
  app.use("/api/v1/tutorialVideoByCategory", tutorialVideoByCategory);
  app.use("/api/v1/flashCard", flashCards);

  app.use("/api/v1/forum", forum);
  app.use("/api/v1/static", statics);
  app.use("/api/v1/faq", faq);
  app.use("/api/v1/blog", blog);
  app.use("/api/v1/medBoundCms", medBound);
  app.use("/api/v1/medBoundTimes", medBoundTimes);
  app.use("/api/v1/subAdmin", subAdmin);
  app.use("/api/v1/helpCenterQuestion", helpCenterQuestion);
  app.use("/api/v1/helpCenterQuery", helpCenterQuerie);

  app.use("/api/v1/gallery", gallery);
  app.use("/api/v1/alumini", alumini);

  app.use("/api/v1/banner", Banner);
  app.use("/api/v1/Testimonial", Testimonial);
  app.use("/api/v1/webinar", webinar);
  app.use("/api/v1/mentor", mentor);
  app.use("/api/v1/internship", internship);
  app.use("/api/v1/event", event);
  app.use("/api/v1/exam", exam);

  


  return app;
}

//
