import { t } from "elysia";
import { PROJECT_STATUS, projectStatuses } from "@schema";
import { createEnumObject } from "@utils";

export interface Project {
  id: number;
  name: string;
  description: string| null;
  apiKey: string;
  status: PROJECT_STATUS;
  createdAt: string;
};

export const CreateProjectBodySchema= t.Object({
  name: t.String({ minLength: 1, maxLength: 255 }),
  description: t.Optional( t.String() ),
  status: t.Optional( t.Enum( createEnumObject( projectStatuses )))
});

export const UpdateProjectBodySchema= t.Partial( CreateProjectBodySchema );

export const IdParamSchema= t.Object({
  id: t.Numeric()
});

export type CreateProjectBody= ( typeof CreateProjectBodySchema )[ "static "];

export type UpdateProjectBody= ( typeof UpdateProjectBodySchema )[ "static "];
