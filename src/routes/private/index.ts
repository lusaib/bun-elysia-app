import Elysia, { t } from "elysia";
import linksRoutes from "./linksRoutes";
import authGuard from "../../middleware/auth";

/**
 * @author Lusaib Latheef
 * @description the application private routes to handle the privately accessible endpoints with a token.
 */
const privateRoutes = (app: Elysia) =>
  app.group(
    "/private",
    {
      headers: t.Object({
        authorization: t.String({
          error() {
            return "Autnorization not found";
          },
        }),
      }),
    },
    (app) => app.use(authGuard).use(linksRoutes)
  );

export default privateRoutes;
