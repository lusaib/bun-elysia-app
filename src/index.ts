import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import openapi, { fromTypes } from "@elysiajs/openapi";
import { cors } from "@elysiajs/cors";
import routes from "./routes";

const app = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET ?? "dev-secret",
    })
  )
  .use(cors())
  .use(
    openapi({
      references: fromTypes(
        process.env.NODE_ENV === "production"
          ? "dist/index.d.ts"
          : "src/index.ts"
      ),
    })
  )
  .use(routes);

const port = Number(process.env.PORT || 3000);
app.listen({ port });
console.log(`Server listening on http://localhost:${port}`);
