export class UserUnauthorizedError extends Error {

  status= 401

  constructor() {
    super( "Unauthorized" );
    this.name= "UserUnauthorizedError";
  }

  toResponse() {
    return Response.json({
      message: this.message,
      code: this.status
    }, {
      status: this.status
    });
  }
};

export class UserExistsError extends Error {

  status= 409;

  constructor( email: string ) {
    super( `User with email ${ email } already exists` );
    this.name= "UserExistsError";
  }

  toResponse() {
    return Response.json({
      message: this.message,
      code: this.status
    }, {
      status: this.status
    });
  }
};

export class UserNotFoundError extends Error {

  status= 404;

  constructor( id: number ) {
    super( `User with id ${ id } not found` );
    this.name= "UserNotFoundError";
  }

  toResponse() {
    return Response.json({
      message: this.message,
      code: this.status
    }, {
      status: this.status
    });
  }
};

export class AccessDeniedError extends Error {

  status= 403;

  constructor( message: string ) {
    super( message );
    this.name= "AccessDeniedError"
  }

  toResponse() {
    return Response.json({
      message: this.message,
      code: this.status
    }, {
      status: this.status
    });
  }
}
