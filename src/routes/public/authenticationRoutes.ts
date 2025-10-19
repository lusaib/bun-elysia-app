import Elysia, { t } from "elysia";
import {
  signInValidations,
  signUpValidations,
} from "../../validations/authValidations";

/**
 * @author Lusaib Latheef
 * @description the authentication related routes.
 */
const authenticationRoutes = (app: Elysia) =>
  app.group(
    "/auth",
    {
      tags: ["Authentication"],
    },
    (app) =>
      app
        .post("/sign-in", ({ body }) => `${body.username} - ${body.password}`, {
          body: signInValidations,
          detail: {
            summary: "Sign in the user",
            tags: ["Authentication"],
          },
        })
        .post(
          "/sign-up",
          ({ body }) => `${body.email} - ${body.phone} - ${body.password}`,
          {
            body: signUpValidations,
            detail: {
              summary: "Sign up the user",
              tags: ["Authentication"],
            },
          }
        )
    // .post("/profile", "Profile")
  );
export default authenticationRoutes;
