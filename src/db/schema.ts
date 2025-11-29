import { relations, sql } from "drizzle-orm";
import {
  int,
  sqliteTable,
  text,
  unique
} from "drizzle-orm/sqlite-core";

export const userRoles= [ "admin", "editor" ] as const;
export type USER_ROLE= ( typeof userRoles )[ number ];

export const projectStatuses= [ "ACTIVE", "ARCHIVED", "PLANNED" ] as const;
export type PROJECT_STATUS= ( typeof projectStatuses )[ number ];

export const projects= sqliteTable( "projects", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  description: text(),
  status:
    text( "status", { enum: projectStatuses })
    .default( "PLANNED" )
    .notNull(),
  apiKey: text( "api_key" ).notNull().unique(),
  createdAt: text( "created_at" ).default( sql`CURRENT_TIMESTAMP` )
});

export const contentVariables= sqliteTable( "content_variables", {
  id: int().primaryKey({ autoIncrement: true }),
  keyName: text( "key_name" ).notNull(),
  value: text().notNull(),
  projectId: int( "project_id" ).notNull().references( ()=> projects.id )
});

export const contentVariablesIdx= unique( "key_per_project" ).on(
  contentVariables.projectId,
  contentVariables.keyName
);

export const users= sqliteTable( "users", {
  id: int().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  passwordHash: text( "password_hash" ).notNull(),
  role: text( "role", { enum: userRoles }).notNull().default( "editor" ),
  createdAt: text( "created_at" ).default( sql`CURRENT_TIMESTAMP` ).notNull()
});

export const projectRelations= relations( projects, ({ many })=> ({
  variables: many( contentVariables )
}));

export const contentVariablesRelations= relations(
  contentVariables,
  ({ one })=> ({
    project: one( projects, {
      fields: [ contentVariables.projectId ],
      references: [ projects.id ]
    })
  })
);
