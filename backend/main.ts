import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import authRoutes from "./routes/authRoutes.ts";
import dinosaurRoutes from "./routes/dinosaurRoutes.ts";

const app = new Application();

// Routes
app.use(dinosaurRoutes.routes());
app.use(dinosaurRoutes.allowedMethods());
app.use(authRoutes.routes());
app.use(authRoutes.allowedMethods());

// Root route
app.use((context) => {
  if (context.request.url.pathname === "/") {
    context.response.body = "Welcome to the Dinosaur API!";
  }
});

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
