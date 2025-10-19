import { PrismaClient } from "@prisma/client";

// Use single shared Prisma client across the app to avoid too many connections.
const prisma = new PrismaClient();
export default prisma;
