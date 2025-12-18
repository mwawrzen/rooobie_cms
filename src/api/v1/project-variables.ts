import Elysia, { t } from "elysia";
import { contentService } from "@modules/content/service";
import { ContentVariableBodySchema } from "@modules/content/schemas";

const KeyParamSchema= t.Object({
  key: t.String()
});

export type KeyParams= ( typeof KeyParamSchema )[ "static" ];

export const projectVariablesRouter= new Elysia({ prefix: "/variable" })
  .post( "/", async ({ params, body, user, status }: any )=> {
    const variable= await contentService.create(
        Number( params.id ),
        body,
        user
      );
    return status( 201, variable );
  }, {
    body: ContentVariableBodySchema
  })
  .get( "/", async ({ params, user }: any )=> {
    const variables= await contentService.getAll(
        Number( params.id ),
        user
      );
    return variables;
  })
  .put( "/", async ({ params, body, user, status }: any )=> {
    const variable= await contentService.update(
        Number( params.id ),
        body,
        user
      );
    return status( 201, variable );
  }, {
    body: ContentVariableBodySchema
  })
  .delete( "/:key", async ({ params, user, status }: any )=> {
    await contentService.remove(
        Number( params.id ),
        params.key,
        user
      );
    status( 204 );
  }, {
    body: KeyParamSchema
  });
