import { Elysia, t } from "elysia";

/**
 * @author Lusaib Latheef
 * @description the links related routes.
 */
const linksRoutes = new Elysia({ prefix: "/links" })
  .get("/", "Get all links")
  .post("/create", "Create link")
  .guard({
    params: t.Object({
      id: t.Number(),
    }),
  })
  .get("/:id", ({ params: { id } }) => `User - ${id}`)
  .post("/edit/:id", ({ params: { id } }) => `Edit - ${id}`)
  .post("/delete/:id", ({ params: { id } }) => `Delete - ${id}`);

export default linksRoutes;
