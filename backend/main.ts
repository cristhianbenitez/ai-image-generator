import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import authRoutes from "./routes/authRoutes.ts";
import imageRoutes from "./routes/imageRoutes.ts";

const app = new Application();

// CORS configuration
app.use(
  oakCors({
    origin: ["http://localhost:5173", "https://taanga-app.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
  })
);

// Routes
app.use(authRoutes.routes());
app.use(authRoutes.allowedMethods());
app.use(imageRoutes.routes());
app.use(imageRoutes.allowedMethods());

// Root route
app.use((context) => {
  if (context.request.url.pathname === "/") {
    context.response.body = "Welcome to the API!";
  }
});

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
