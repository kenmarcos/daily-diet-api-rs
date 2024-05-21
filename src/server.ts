import { app } from "./app";
import { env } from "./env";
import "dotenv/config";

app
  .listen({
    port: env.PORT,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("HTTP server running on http://localhost:3333");
  });
