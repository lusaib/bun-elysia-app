import { Elysia, t } from "elysia";
import prisma from "../libs/prisma";

type JWTPayload = { id: string };

const authGuard = (app: Elysia) =>
  app
    .decorate("jwt", null as any)
    .decorate("user", null as any)
    .onBeforeHandle(async ({ headers, jwt, set }) => {
      const authHeader = headers.authorization;

      const token = authHeader?.split(" ")[1];

      if (!authHeader || !token) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const payload = (await jwt.verify(token)) as JWTPayload | false;

      if (!payload || !payload.id) {
        set.status = 401;
        return { error: "Unauthorized: Invalid or expired token" };
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        set.status = 401;
        return { error: "Unauthorized: User not found" };
      }

      // This is the clean, type-safe way to pass data to the final handler.
      (app as any).user = user;
    });

export default authGuard;
