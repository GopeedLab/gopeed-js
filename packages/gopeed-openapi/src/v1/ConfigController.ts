/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { DownloaderStoreConfig, Result } from '@gopeed/types';
import { Body, Controller, Get, Put, Route, Security, SuccessResponse, Tags } from 'tsoa';

@Route('/api/v1/config')
@Tags('Config')
export class ConfigController extends Controller {
  /**
   * Get downloader configuration
   * @summary Get config
   */
  @Security('X-Api-Token')
  @Get()
  public async getConfig(): Promise<Result<DownloaderStoreConfig>> {
    return null as unknown as Result<DownloaderStoreConfig>;
  }

  /**
   * Update downloader configuration
   * @summary Put config
   */
  @Security('X-Api-Token')
  @Put()
  @SuccessResponse(200)
  public async putConfig(@Body() config: DownloaderStoreConfig): Promise<Result<void>> {
    return null as unknown as Result<void>;
  }
}
