import { relations, sql } from "drizzle-orm";
import { int, sqliteTable, text, unique, primaryKey } from "drizzle-orm/sqlite-core";
import { PROJECT_STATUSES } from "@modules/project/schemas";
import { USER_ROLES } from "@modules/user/schemas";

export const users= sqliteTable( "users", {
  id: int().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  passwordHash: text( "password_hash" ).notNull(),
  role:
    text( "role", { enum: USER_ROLES })
    .notNull()
    .default( "EDITOR" ),
  createdAt: text( "created_at" ).default( sql`CURRENT_TIMESTAMP` ).notNull()
});

export const projects= sqliteTable( "projects", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  description: text(),
  status:
    text( "status", { enum: PROJECT_STATUSES })
    .default( "PLANNED" )
    .notNull(),
  apiKey: text( "api_key" ).notNull().unique(),
  createdAt: text( "created_at" ).default( sql`CURRENT_TIMESTAMP` ).notNull()
});

export const contentVariables= sqliteTable( "content_variables", {
  id: int().primaryKey({ autoIncrement: true }),
  key: text( "key" ).notNull(),
  value: text().notNull(),
  projectId: int( "project_id" ).notNull().references( ()=> projects.id )
});

export const userProjects= sqliteTable( "user_projects", {
  userId:
    int( "user_id", { mode: "number" })
    .notNull()
    .references( ()=> users.id, { onDelete: "cascade" }),
  projectId:
    int( "project_id", { mode: "number" })
    .notNull()
    .references( ()=> projects.id, { onDelete: "cascade" }),
  role:
    text( "role", { enum: USER_ROLES })
    .notNull()
    .default( "EDITOR" )
}, t=> ({
  pk: primaryKey({ columns: [ t.userId, t.projectId ]})
}));

/* RELATIONS */

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

/* UNIQUE VALIDATION */

export const contentVariablesIdx= unique( "key_per_project" ).on(
  contentVariables.projectId,
  contentVariables.key
);
