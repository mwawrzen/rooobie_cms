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
