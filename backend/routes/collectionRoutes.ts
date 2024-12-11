import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { CollectionController } from "../controllers/collectionController.ts";

const collectionController = new CollectionController();
const router = new Router();

router
  .post("/api/collections", (ctx) => collectionController.saveToCollection(ctx))
  .get("/api/collections/:userId", (ctx) => collectionController.getUserCollections(ctx))
  .delete("/api/collections/:userId/:imageId", (ctx) => collectionController.removeFromCollection(ctx));

export default router;
