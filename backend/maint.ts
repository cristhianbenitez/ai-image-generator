import { PrismaClient } from "../backend/generated/client/deno/edge.js";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const envVariables = config({ export: true });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: envVariables.DATABASE_URL,
    },
  },
});

const app = new Application();
const router = new Router();

router.get("/", async (ctx) => {
  const dinosaurs = await prisma.dinosaur.findMany();
  ctx.response.body = dinosaurs;
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 3000 });

console.log("Server running on http://localhost:3000");
