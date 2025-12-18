import { afterEach, describe, expect, it, mock } from "bun:test";
import { contentService } from "@modules/content/service";
import { projectRepository } from "@modules/project/repository";
import { ProjectAccessDeniedError } from "@modules/content/errors";

mock.module( "@modules/project/repository", ()=> ({
  projectRepository: {
    fetchProjectRole: mock()
  }
}));

describe( "ContentService - checkProjectAccess", ()=> {

  it( "should let admin always have an access", async ()=> {
    const adminUser= { id: 1, role: "ADMIN", email: "admin@example.com" } as any;

    expect( contentService.checkProjectAccess( adminUser, 101 ))
      .resolves
      .toBeUndefined();

    expect( projectRepository.fetchProjectRole ).not.toHaveBeenCalled();
  });

  it( "should let editor have an access, if he is in a project", async ()=> {
    const editorUser= { id: 2, role: "EDITOR", email: "editor@example.com" } as any;

    ( projectRepository.fetchProjectRole as any ).mockResolvedValue( "EDITOR" );

    expect( contentService.checkProjectAccess( editorUser, 101 ))
      .resolves
      .toBeUndefined();

    expect( projectRepository.fetchProjectRole ).toHaveBeenCalledWith( 2, 101 );
  });

  it( "should throw an error, if user is not assigned to a project", async ()=> {
    const editorUser= { id: 3, role: "EDITOR", email: "wrong@example.com" } as any;

    ( projectRepository.fetchProjectRole as any ).mockResolvedValue( undefined );

    expect( contentService.checkProjectAccess( editorUser, 999 ))
      .rejects
      .toThrow( ProjectAccessDeniedError );
  });

  afterEach(()=> {
    mock.restore();
  });
});
