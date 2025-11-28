import { Elysia } from "elysia";
import { apiV1 } from "@/src/api/v1";

const PORT= process.env.PORT!;

const app= new Elysia()
  .use( apiV1 );

app.listen( PORT, ({ hostname, port })=> {

  console.log( `🚀 Server running at http://${ hostname }:${ port }` );
  console.log( "\n--- API routes ---" );

  app.routes.forEach( route=> {
    console.log( `[${ route.method }] ${ route.path }` );
  });

  console.log( "------------------" );
});
