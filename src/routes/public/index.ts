import Elysia from "elysia";
import authenticationRoutes from "./authenticationRoutes";

/**
 * @author Lusaib Latheef
 * @description the application public routes to handle the publicly accessible endpoints without a token.
 */
const publicRoutes = (app: Elysia) =>
  app.group("/public", {}, (app) => app.use(authenticationRoutes));

export default publicRoutes;
