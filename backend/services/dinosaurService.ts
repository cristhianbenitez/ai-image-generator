import { PrismaClient } from "../generated/client/deno/edge.ts";
import { env } from "../config/env.ts";

const prisma = new PrismaClient({
  datasources: { db: { url: env.DATABASE_URL } },
});

export class DinosaurService {
  async getAllDinosaurs() {
    return await prisma.dinosaur.findMany();
  }

  async getDinosaurById(id: number) {
    return await prisma.dinosaur.findUnique({
      where: { id },
    });
  }

  async createDinosaur(data: { name: string; description: string }) {
    return await prisma.dinosaur.create({ data });
  }

  async deleteDinosaur(id: number) {
    return await prisma.dinosaur.delete({
      where: { id },
    });
  }
} 
