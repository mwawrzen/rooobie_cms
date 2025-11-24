import { sql } from "drizzle-orm";
import {
  AnySQLiteColumn,
  int,
  sqliteTable as table,
  text
} from "drizzle-orm/sqlite-core";

export const dashboards= table( "dashboards", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  configJson:
    text( "config_json", { mode: "json" })
    .$type<{ globalFilters?: string[], theme?: string }>(),
  createdAt: text( "created_at" ).default( sql`CURRENT_TIMESTAMP` )
});

export const widgets= table( "widgets", {
  id: int().primaryKey({ autoIncrement: true }),
  dashboardId:
    int( "dashboard_id" )
    .notNull()
    .references( (): AnySQLiteColumn=> dashboards.id ),
  title: text().notNull(),
  type: text().notNull(),
  positionX: int( "position_x" ).notNull(),
  positionY: int( "position_y" ).notNull(),
  width: int().notNull().default( 1 ),
  height: int().notNull().default( 1 ),
  settingsJson:
    text( "settings_json", { mode: "json" })
    .$type<{ xAxis?: string, yAxis?: string, seriesColors?: string[] }>(),
  sourceKey: text( "source_key" ).notNull()
});

export const dataPoints= table( "data_points", {
  id: int().primaryKey({ autoIncrement: true }),
  sourceKey: text( "source_key" ).notNull(),
  key: text().notNull(),
  value: int({ mode: "number" }).notNull(),
  metadataJson: text( "metadata_json", { mode: "json" }),
  timestamp: text().default( sql`CURRENT_TIMESTAMP` )
});
