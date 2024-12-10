import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { DinosaurController } from "../controllers/dinosaurController.ts";

const dinosaurController = new DinosaurController();
const router = new Router();

router
  .get("/dinosaur", (ctx) => dinosaurController.getAll(ctx))
  .get("/dinosaur/:id", (ctx) => dinosaurController.getOne(ctx))
  .post("/dinosaur", (ctx) => dinosaurController.create(ctx))
  .delete("/dinosaur/:id", (ctx) => dinosaurController.delete(ctx));

export default router; 
