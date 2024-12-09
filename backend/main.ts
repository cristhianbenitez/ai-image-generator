import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { OAuth2Client } from "https://deno.land/x/oauth2/mod.ts";
import { PrismaClient } from "./generated/client/deno/edge.ts";

// Configuración de variables de entorno
const env = config();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
});

const app = new Application();
const router = new Router();

// Configura OAuth2 para GitHub
const oauth2Client = new OAuth2Client({
  clientId: env.GITHUB_CLIENT_ID, // Tu Client ID de GitHub
  clientSecret: env.GITHUB_CLIENT_SECRET, // Tu Client Secret de GitHub
  authorizationEndpointUri: "https://github.com/login/oauth/authorize",
  tokenUri: "https://github.com/login/oauth/access_token",
  redirectUri: "http://localhost:8000/auth/github/callback", // Asegúrate de que coincida con el registro en GitHub
  defaults: {
    scope: "read:user user:email", // Solicita acceso a datos básicos del usuario
  },
});

/**
 * Setup routes.
 */
router
  .get("/", (context) => {
    context.response.body = "Welcome to the Dinosaur API!";
  })
  .get("/dinosaur", async (context) => {
    // Get all dinosaurs.
    const dinosaurs = await prisma.dinosaur.findMany();
    context.response.body = dinosaurs;
  })
  .get("/dinosaur/:id", async (context) => {
    // Get one dinosaur by id.
    const { id } = context.params;
    const dinosaur = await prisma.dinosaur.findUnique({
      where: {
        id: Number(id),
      },
    });
    context.response.body = dinosaur;
  })
  .post("/dinosaur", async (context) => {
    // Create a new dinosaur.
    const { name, description } = await context.request.body("json").value;
    const result = await prisma.dinosaur.create({
      data: {
        name,
        description,
      },
    });
    context.response.body = result;
  })
  .delete("/dinosaur/:id", async (context) => {
    // Delete a dinosaur by id.
    const { id } = context.params;
    const dinosaur = await prisma.dinosaur.delete({
      where: {
        id: Number(id),
      },
    });
    context.response.body = dinosaur;
  });

// Ruta para redirigir al usuario a GitHub
router.get("/auth/github", (context) => {
  const authUrl = oauth2Client.code.getAuthorizationUri();
  context.response.redirect(authUrl);
});

// Callback para procesar la respuesta de GitHub
router.get("/auth/github/callback", async (context) => {
  const url = context.request.url;
  const code = url.searchParams.get("code");

  if (!code) {
    context.response.status = 400;
    context.response.body = { error: "Authorization code not found" };
    return;
  }

  try {
    // Intercambia el código por un token de acceso
    const token = await oauth2Client.code.getToken(url.toString());
    console.log("Token recibido:", token);

    // Usa el token para obtener información del usuario desde GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    if (!userResponse.ok) {
      context.response.status = userResponse.status;
      context.response.body = await userResponse.text();
      return;
    }
    const userInfo = await userResponse.json();
    console.log("User Info:", userInfo);

    // Solicita los correos electrónicos del usuario
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    if (!emailResponse.ok) {
      context.response.status = emailResponse.status;
      context.response.body = await emailResponse.text();
      return;
    }
    const emails = await emailResponse.json();
    console.log("User Emails:", emails);

    // Selecciona el correo principal (o cualquier correo disponible)
    const primaryEmail = emails.find((email: any) => email.primary)?.email ||
      emails[0]?.email;

    if (!primaryEmail) {
      context.response.status = 400;
      context.response.body = {
        error: "No email associated with GitHub account",
      };
      return;
    }

    // Almacena o utiliza los datos del usuario en tu base de datos
    let user = await prisma.user.findUnique({
      where: { email: primaryEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: primaryEmail,
          name: userInfo.name || "GitHub User",
          githubId: userInfo.id.toString(),
        },
      });
    }

    context.response.body = {
      message: "Authenticated successfully",
      user,
    };
  } catch (error) {
    console.error("Error durante la autenticación con GitHub:", error);
    context.response.status = 500;
    context.response.body = { error: "Failed to authenticate with GitHub" };
  }
});

/**
 * Setup middleware.
 */
app.use(router.routes());
app.use(router.allowedMethods());

/**
 * Start server.
 */
console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
