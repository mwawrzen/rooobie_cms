export class ContentVariableNotFoundError extends Error {

  status= 404;

  constructor( key: string ) {
    super( `Content variable with key ${ key } not found` );
    this.name= "ContentVariableNotFoundError";
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

export class ProjectAccessDeniedError extends Error {

  status= 403;

  constructor( id: number ) {
    super( `Access to project wiht id ${ id } denied` );
    this.name= "ProjectAccessDeniedError";
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
