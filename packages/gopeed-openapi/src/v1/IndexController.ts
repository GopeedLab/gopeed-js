/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Result, ServerInfo } from '@gopeed/types';
import { Controller, Get, Route, Security, Tags } from 'tsoa';

@Route('/api/v1')
@Tags('Info')
export class IndexController extends Controller {
  /**
   * Get gopeed info
   * @summary Get gopeed info
   */
  @Security('X-Api-Token')
  @Get('/info')
  public async info(): Promise<Result<ServerInfo>> {
    return null as unknown as Result<ServerInfo>;
  }
}
