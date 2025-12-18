import Elysia from "elysia";
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { eq } from "drizzle-orm";
import { jwtConfig } from "@auth/jwt.plugin";
import { projects, users } from "@schema";
import { db } from "@db";
import { api } from "@v1/index";

const generateToken= async (
  payload: { userId: number, role: string, email: string }
)=> {
  const app= new Elysia().use( jwtConfig );
  return await app.decorator.jwt.sign( payload );
};

describe( "E2E: Project Management Flow", ()=> {

  let adminToken: string;
  let testProjectId: number;

  beforeAll(async ()=> {
    await db.insert( users ).values({
      id: 99,
      email: "admin@e2e.com",
      passwordHash: "",
      role: "ADMIN"
    }).onConflictDoNothing();

    adminToken= await generateToken({
      userId: 99,
      email: "admin@e2e.com",
      role: "ADMIN"
    });
  });

  it( "should create a project and assign an editor to it", async ()=> {
    const createRes= await api.handle(
      new Request( "http://localhost/api/v1/admin/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": `auth=${ adminToken }`
        },
        body: JSON.stringify({ name: "E2E Project" })
      }
    ));

    const project= await createRes.json();
    testProjectId= project.id;

    expect( createRes.status ).toBe( 201 );

    const dbProject= await db.query.projects.findFirst({
      where: eq( projects.id, testProjectId )
    });

    expect( dbProject?.name ).toBe( "E2E Project" );
  });

  afterAll(async ()=> {
    await db.delete( projects ).where( eq( projects.id, testProjectId ));
    await db.delete( users ).where( eq( users.id, 99 ));
  });
});
