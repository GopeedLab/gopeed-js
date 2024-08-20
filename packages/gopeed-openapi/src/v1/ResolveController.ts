/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Request, ResolveResult, Result } from '@gopeed/types';
import { Body, Controller, Post, Route, Security } from 'tsoa';

@Route('/api/v1/resolve')
export class UsersController extends Controller {
  /**
   * Resolve resource info from request, contains file name, size, etc.
   * @summary Resolve a request
   */
  @Security('X-Api-Token')
  @Post()
  public async resolve(@Body() req: Request): Promise<Result<ResolveResult>> {
    return null as unknown as Result<ResolveResult>;
  }
}
