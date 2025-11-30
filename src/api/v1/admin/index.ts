import { Elysia } from "elysia";
import { userRouter } from "./user";
import { projectRouter } from "./project";

export const adminRouter= new Elysia()
  .use( userRouter )
  .use( projectRouter );
