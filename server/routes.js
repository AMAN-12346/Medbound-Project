//v7 imports
import user from "./api/v1/controllers/user/routes";
import admin from "./api/v1/controllers/Admin/routes";
import tutorial from "./api/v1/controllers/TutorialVideo/routes";
import tutorialVideo from "./api/v1/controllers/tutorialVideoByCatgory/routes";
import flashCards from "./api/v1/controllers/flashCards/routes";


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
  


  return app;
}
