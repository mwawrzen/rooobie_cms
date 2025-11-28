import { eq } from "drizzle-orm";
import { db } from "@db";
import { users } from "@schema";
import { hashPassword } from "@modules/user/service";

const ADMIN_EMAIL= process.env.APP_ADMIN_EMAIL!;
const ADMIN_PWD= process.env.APP_ADMIN_PWD!;

async function seedDb() {
  console.log( "🌱 Starting database seeding..." );

  const existingAdmin= await db.query.users.findFirst({
    where: eq( users.email, ADMIN_EMAIL )
  });

  if( existingAdmin ) {
    console.log( "✅ Default admin already exists. Skipping seed." );
    return;
  }

  const pwdHash= await hashPassword( ADMIN_PWD );

  await db.insert( users ).values({
    email: ADMIN_EMAIL,
    passwordHash: pwdHash
  });

  console.log( "✅ Database seeding complete." );
}

seedDb().catch( err=> {
  console.error( "❌ Database seeding failed." );
});
