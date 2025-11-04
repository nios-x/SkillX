// utils/prismaClient.ts
import { PrismaClient } from "@/lib/generated/prisma"; // adjust based on folder location
const prisma = new PrismaClient();
export default prisma;