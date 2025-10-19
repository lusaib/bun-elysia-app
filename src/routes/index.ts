import Elysia from "elysia";
import privateRoutes from "./private";
import publicRoutes from "./public";

/**
 * @author Lusaib Latheef
 * @description the application main routes entry point.
 */
const routes = (app: Elysia) =>
  app.group("/app", {}, (app) => app.use(publicRoutes).use(privateRoutes));

export default routes;
