import { Elysia } from "elysia";
import { api } from "@/src/api/v1/index";

const PORT= process.env.PORT!;

const app= new Elysia()
  .use( api );

app.listen( PORT, ({ hostname, port })=> {

  console.log( `🚀 Server running at http://${ hostname }:${ port }` );
  console.log( "\n--- API routes ---" );

  app.routes.forEach( route=> {
    console.log( `[${ route.method }] ${ route.path }` );
  });

  console.log( "------------------" );
});
