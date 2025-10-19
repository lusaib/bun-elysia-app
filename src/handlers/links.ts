import { linkCreateSchema } from "../schemas/zod-schemas";
import prisma from "../libs/prisma";

export default (app) => {
  app.group("/links", (g) => {
    // Add auth middleware to group in app.ts when mounting

    g.get("/", async (c) => {
      const user = c.get("user");
      const links = await prisma.link.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
      return links;
    });

    g.post("/", async (c) => {
      const user = c.get("user");
      const body = linkCreateSchema.parse(await c.body());
      const link = await prisma.link.create({
        data: { ...body, userId: user.id },
      });
      return link;
    });

    g.put("/:id", async (c) => {
      const user = c.get("user");
      const { id } = c.params;
      const data = await c.body();
      const existing = await prisma.link.findUnique({ where: { id } });
      if (!existing || existing.userId !== user.id)
        return c.error("Not found", { status: 404 });
      const updated = await prisma.link.update({ where: { id }, data });
      return updated;
    });

    g.delete("/:id", async (c) => {
      const user = c.get("user");
      const { id } = c.params;
      const link = await prisma.link.findUnique({ where: { id } });
      if (!link || link.userId !== user.id)
        return c.error("Not found", { status: 404 });
      await prisma.link.delete({ where: { id } });
      return { ok: true };
    });
  });
};
