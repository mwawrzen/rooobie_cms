import { contentPublicService } from "@/src/modules/content/public.service";
import { IdParamSchema } from "@modules/project/schemas";
import { projectService } from "@modules/project/service";
import Elysia from "elysia";

export const publicRouter= new Elysia()
  .get( "/projects", async ()=> {
    return await projectService.getAll();
  })
  .get( "/project/:id/variables", async ({ params: { id }})=> {
    const variables= await contentPublicService.getAll( id );

    const variablesMap= variables.reduce(( acc, curr )=> {
      acc[ curr.key ]= curr.value;
      return acc;
    }, {} as Record<string, string>);

    return variablesMap;
  }, {
    params: IdParamSchema
  });
