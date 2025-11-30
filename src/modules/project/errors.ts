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
