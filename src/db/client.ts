import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { Database } from "bun:sqlite";
import * as schema from "@schema";
import { userService } from "../modules/user/service";
import { users } from "@schema";
import { eq } from "drizzle-orm";

const ADMIN_EMAIL= process.env.APP_ADMIN_EMAIL!;
const ADMIN_PWD= process.env.APP_ADMIN_PWD!;

const DB_PATH= process.env.DB_PATH|| "roobie.db";
const DB_MIGRATIONS_PATH= process.env.DB_MIGRATIONS_PATH|| "./drizzle";

const sqlite= new Database( DB_PATH );
export const db= drizzle( sqlite, { schema });

export async function setupDatabase() {
  runMigrations();
  await seedDatabase();
  console.log( "Database setup finished" );
}

async function seedDatabase() {
  console.log( "🌱 Starting database seeding..." );

  const existingAdmin= await db.query.users.findFirst({
    where: eq( users.email, ADMIN_EMAIL )
  });

  if( existingAdmin ) {
    console.log( "✅ Default admin already exists. Skipping seed." );
    return;
  }

  const pwdHash= await userService.hashPassword( ADMIN_PWD );

  await db.insert( users ).values({
    email: ADMIN_EMAIL,
    passwordHash: pwdHash,
    role: "ADMIN"
  }).onConflictDoNothing({ target: users.email });

  console.log( "✅ Database seeding complete." );
}

function runMigrations() {
  migrate( db, { migrationsFolder: DB_MIGRATIONS_PATH });
}
