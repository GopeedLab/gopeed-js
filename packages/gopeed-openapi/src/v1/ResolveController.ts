/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { CreateResolve, ResolveResult, Result } from '@gopeed/types';
import { Body, Controller, Post, Route, Security, Tags } from 'tsoa';

@Route('/api/v1/resolve')
@Tags('Tasks')
export class UsersController extends Controller {
  /**
   * Resolve resource info from request, contains file name, size, etc.
   * @summary Resolve a request
   */
  @Security('X-Api-Token')
  @Post()
  public async resolve(@Body() req: CreateResolve): Promise<Result<ResolveResult>> {
    return null as unknown as Result<ResolveResult>;
  }
}
