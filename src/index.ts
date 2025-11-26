import { Elysia } from "elysia";
import { apiV1 } from "@/src/api/v1";

const PORT= process.env.PORT!;

const app= new Elysia()
  .use( apiV1 )
  .listen( PORT );

console.log(
  `🚀 Server running at ${ app.server?.hostname }:${ app.server?.port }`
);
