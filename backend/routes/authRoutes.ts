import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { AuthController } from "../controllers/authController.ts";

const authController = new AuthController();
const router = new Router();

router
  .get("/auth/github", (ctx) => authController.githubAuth(ctx))
  .get("/auth/github/callback", (ctx) => authController.githubCallback(ctx));

export default router;
