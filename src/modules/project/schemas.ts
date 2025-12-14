import { t } from "elysia";
import { USER_ROLES } from "@modules/user/schemas";
import { createEnumObject } from "@utils";

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

export const UpdateProjectRolesBodySchema= t.Object({
  updates: t.Array( t.Object({
    userId: t.Numeric(),
    role: t.Enum( createEnumObject( USER_ROLES ))
  }))
});

export const IdParamSchema= t.Object({
  id: t.Numeric()
});

export type CreateProjectBody= ( typeof CreateProjectBodySchema )[ "static "];

export type UpdateProjectBody= ( typeof UpdateProjectBodySchema )[ "static "];

export type UpdateProjectRolesBody=
  ( typeof UpdateProjectRolesBodySchema )[ "static "];
