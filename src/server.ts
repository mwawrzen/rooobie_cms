import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { api } from "@/src/api/v1/index";
import { setupDatabase } from "@db";

const PORT= process.env.PORT!;

const app= new Elysia()
  .onStart( async ()=> await setupDatabase() )
  .use( openapi({
    documentation: {
      info: {
        title: "Roobie CMS API",
        version: "1.0.0",
        description: "Documentation of Roobie CMS REST API"
      }
    }
  }))
  .use( api );

app.listen( PORT, ({ hostname, port })=> {

  console.log( `🚀 Server running at http://${ hostname }:${ port }` );
  console.log( "\n--- API routes ---" );

  app.routes.forEach( route=> {
    console.log( `[${ route.method }] ${ route.path }` );
  });

  console.log( "------------------" );
});
