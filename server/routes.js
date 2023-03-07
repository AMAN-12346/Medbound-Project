//v7 imports
import user from "./api/v1/controllers/user/routes";
import admin from "./api/v1/controllers/Admin/routes";

import tutorial from "./api/v1/controllers/TutorialVideo/routes";
import tutorialVideo from "./api/v1/controllers/tutorialVideoByCatgory/routes";
import flashCards from "./api/v1/controllers/flashCards/routes";

import forum from "./api/v1/controllers/ForumAndSocial_Clubs/routes";
import statics from "./api/v1/controllers/faq/routes";
import faq from "./api/v1/controllers/faq/routes";
import blog from "./api/v1/controllers/Blog/routes";
import medBound from "./api/v1/controllers/MedBoundCMS/routes";
import medBoundTimes from "./api/v1/controllers/MedBoundTimes/routes";



/**
 *
 *
 * @export
 * @param {any} app
 */

export default function routes(app) {

  app.use('/api/v1/user', user);
  app.use('/api/v1/admin', admin);

  app.use('/api/v1/tutorialVideo', tutorial);
  app.use('/api/v1/flashCard', flashCards);

  app.use('/api/v1/forum', forum);
  app.use("/api/v1/static", statics);
  app.use("/api/v1/faq", faq);
  app.use("/api/v1/blog", blog);
  app.use("/api/v1/medBoundCms", medBound);
  app.use("/api/v1/medBoundTimes", medBoundTimes);

  


  return app;
}
