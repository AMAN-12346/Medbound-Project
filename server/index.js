import Config from "config";
import Routes from "./routes";
import Server from "./common/server";

const dbUrl = "mongodb+srv://booking:booking123@cluster0.4olhgpv.mongodb.net/TESTING_MODE";
const server = new Server()
  .router(Routes)
  .configureSwagger(Config.get("swaggerDefinition"))
  .handleError()
  .configureDb(dbUrl)
  .then((_server) => _server.listen(Config.get("port")));

export default server;
