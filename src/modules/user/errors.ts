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
  constructor() {
    super( `User with given email already exists` );
    this.name= "UserExistsError";
  }
};

export class UserNotFoundError extends Error {
  constructor() {
    super( "User not found" );
    this.name= "UserNotFoundError";
  }
};
