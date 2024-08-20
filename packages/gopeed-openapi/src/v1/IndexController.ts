/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Result, ServerInfo } from '@gopeed/types';
import { Controller, Get, Route, Security } from 'tsoa';

@Route('/api/v1')
export class UsersController extends Controller {
  /**
   * Get server info
   * @summary Get server info
   */
  @Security('X-Api-Token')
  @Get('/info')
  public async info(): Promise<Result<ServerInfo>> {
    return null as unknown as Result<ServerInfo>;
  }
}
