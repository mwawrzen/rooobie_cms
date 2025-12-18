import Elysia from "elysia";
import { projectVariablesRouter } from "@/src/api/v1/project-variables";
import { projectService } from "@modules/project/service";
import { UpdateProjectBodySchema } from "@modules/project/schemas";
import { IdParamSchema } from "@modules/user/schemas";

export const projectRouter= new Elysia({ prefix: "/project" })
  .guard({ params: IdParamSchema }, app=> app
    .group( "/:id", app=> app
      .get( "/", async ({ params: { id }})=> {
        return await projectService.getById( id );
      })
      .patch( "/", async ({ params: { id }, body }) => {
        return await projectService.update( id, body );
      }, {
        body: UpdateProjectBodySchema
      })
      .delete( "/", async ({ params: { id }, status })=> {
        await projectService.remove( id );
        return status( 204 );
      })
      .use( projectVariablesRouter )
    )
  );
