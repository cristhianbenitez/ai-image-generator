import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { ImageController } from "../controllers/imageController.ts";

const imageController = new ImageController();
const router = new Router();

router
  .post("/api/images", (ctx) => imageController.saveImage(ctx))
  .get("/api/images", (ctx) => imageController.getAllImages(ctx))
  .get("/api/users/:userId/images", (ctx) => imageController.getUserImages(ctx));

export default router;
