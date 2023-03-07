//v7 imports
import user from "./api/v1/controllers/user/routes";
import admin from "./api/v1/controllers/Admin/routes";
import forum from "./api/v1/controllers/ForumAndSocial_Clubs/routes";
import club from "./api/v1/controllers/ForumAndSocial_Clubs/routes";
import statics from "./api/v1/controllers/faq/routes";
import faq from "./api/v1/controllers/faq/routes";
import Webinar from "./api/v1/controllers/Webinar/routes";
import mentor from "./api/v1/controllers/Mentor/routes";
import alumini from "./api/v1/controllers/Alumni/routes";


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

  app.use("/api/v1/static", statics);
  app.use("/api/v1/faq", faq);

  app.use("/api/v1/Webinar", Webinar);
  app.use("/api/v1/mentor", mentor);
  app.use("/api/v1/alumini", alumini);



  return app;
}
