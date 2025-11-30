import { t } from "elysia";
import { createEnumObject } from "@/src/utils/utils";

export const PROJECT_STATUSES= [ "PLANNED", "ACTIVE", "ARCHIVED" ] as const;
export type PROJECT_STATUS= typeof PROJECT_STATUSES[ number ];

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
  status: t.Optional( t.Enum( createEnumObject( PROJECT_STATUSES )))
});

export const UpdateProjectBodySchema= t.Partial( CreateProjectBodySchema );

export const IdParamSchema= t.Object({
  id: t.Numeric()
});

export type CreateProjectBody= ( typeof CreateProjectBodySchema )[ "static "];

export type UpdateProjectBody= ( typeof UpdateProjectBodySchema )[ "static "];
