export class ProjectNotFoundError extends Error {

  status= 404;

  constructor( id: number ) {
    super( `Project with id ${ id } not found` );
    this.name= "ProjectNotFoundError";
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

export class ProjectUserNotFoundError extends Error {

  status= 404;

  constructor( userId: number ) {
    super( `Project user with id ${ userId } not found` );
    this.name= "ProjectUserNotFoundError";
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
