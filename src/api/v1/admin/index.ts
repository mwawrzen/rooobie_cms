import { Elysia } from "elysia";
import { userRouter } from "./user";
import { adminProjectRouter } from "./project";

export const adminRouter= new Elysia()
  .use( userRouter )
  .use( adminProjectRouter );
