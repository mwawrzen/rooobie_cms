import { relations, sql } from "drizzle-orm";
import {
  int,
  sqliteTable as table,
  text,
  unique
} from "drizzle-orm/sqlite-core";

export const projects= table( "projects", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  description: text(),
  apiKey: text( "api_key" ).notNull().unique(),
  createdAt: text( "created_at" ).default( sql`CURRENT_TIMESTAMP` )
});

export const contentVariables= table( "content_variables", {
  id: int().primaryKey({ autoIncrement: true }),
  keyName: text( "key_name" ).notNull(),
  value: text().notNull(),
  projectId: int( "project_id" ).notNull().references( ()=> projects.id )
}, t=> ({
  unqKeyPerProject: unique( "key_per_project" ).on( t.projectId, t.keyName )
}));

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
