import Elysia from "elysia";
import { afterEach, describe, expect, it, mock } from "bun:test";
import { api } from "@v1/index";
import { jwtConfig } from "@auth/jwt.plugin";
import { userRepository } from "@/src/modules/user/repository";

mock.module( "@modules/user/repository", ()=> ({
  userRepository: {
    fetchById: mock()
  }
}));

const createReq= ( path: string, method= "GET", token= "valid-token" )=> {
  return new Request( `http://localhost/api/v1${ path }`, {
    method,
    headers: {
      "Cookie": `auth=${ token }`
    }
  });
};

const generateToken= async (
  payload: { userId: number, role: string, email: string }
)=> {
  const app= new Elysia().use( jwtConfig );
  return await app.decorator.jwt.sign( payload );
};

describe( "API Integration - Guards & Routes", ()=> {

  it( "GET /public/projects should be available for everyone", async ()=> {
    const res= await api.handle(
      new Request( "http://localhost/api/v1/public/projects" )
    );
    expect( res.status ).not.toBe( 401 );
  });

  it( "GET /admin/user should be available only for admin", async ()=> {

    ( userRepository.fetchById as any ).mockResolvedValue({
      id: 1,
      role: "EDITOR",
      email: "editor@example.com"
    });

    const token= await generateToken({
      userId: 1,
      role: "EDITOR",
      email: "editor@example.com"
    });

    const req= createReq( "/admin/user", "GET", token );
    const res= await api.handle( req );

    expect( res.status ).toBe( 403 );
  });

  it( "GET /projects/:id should be available for editor", async ()=> {
    const req= createReq( "/projects/1" );
    const res= await api.handle( req );

    expect( res.status ).not.toBe( 403 );
  });

  afterEach(()=> {
    mock.restore();
  });
});
