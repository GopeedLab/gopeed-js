/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import {
  Extension,
  InstallExtension,
  Result,
  SwitchExtension,
  UpdateCheckExtensionResp,
  UpdateExtensionSettings,
} from '@gopeed/types';
import { Body, Controller, Delete, Get, Path, Post, Put, Route, Security, SuccessResponse, Tags } from 'tsoa';

@Route('/api/v1/extensions')
@Tags('Extensions')
export class ExtensionController extends Controller {
  /**
   * Install an extension from a Git URL or a local folder (dev mode)
   * @summary Install extension
   */
  @Security('X-Api-Token')
  @Post()
  public async installExtension(@Body() req: InstallExtension): Promise<Result<string>> {
    return null as unknown as Result<string>;
  }

  /**
   * Get all installed extensions
   * @summary Get extensions
   */
  @Security('X-Api-Token')
  @Get()
  public async getExtensions(): Promise<Result<Extension[]>> {
    return null as unknown as Result<Extension[]>;
  }

  /**
   * Get a single extension by identity
   * @summary Get extension
   * @param identity - Extension identity (e.g. "author@name")
   */
  @Security('X-Api-Token')
  @Get('{identity}')
  public async getExtension(@Path() identity: string): Promise<Result<Extension>> {
    return null as unknown as Result<Extension>;
  }

  /**
   * Update settings of an extension
   * @summary Update extension settings
   * @param identity - Extension identity
   */
  @Security('X-Api-Token')
  @Put('{identity}/settings')
  @SuccessResponse(200)
  public async updateExtensionSettings(
    @Path() identity: string,
    @Body() req: UpdateExtensionSettings
  ): Promise<Result<void>> {
    return null as unknown as Result<void>;
  }

  /**
   * Enable or disable an extension
   * @summary Switch extension
   * @param identity - Extension identity
   */
  @Security('X-Api-Token')
  @Put('{identity}/switch')
  @SuccessResponse(200)
  public async switchExtension(@Path() identity: string, @Body() req: SwitchExtension): Promise<Result<void>> {
    return null as unknown as Result<void>;
  }

  /**
   * Delete an extension
   * @summary Delete extension
   * @param identity - Extension identity
   */
  @Security('X-Api-Token')
  @Delete('{identity}')
  @SuccessResponse(200)
  public async deleteExtension(@Path() identity: string): Promise<Result<void>> {
    return null as unknown as Result<void>;
  }

  /**
   * Check if a new version is available for an extension
   * @summary Check extension update
   * @param identity - Extension identity
   */
  @Security('X-Api-Token')
  @Get('{identity}/update')
  public async updateCheckExtension(@Path() identity: string): Promise<Result<UpdateCheckExtensionResp>> {
    return null as unknown as Result<UpdateCheckExtensionResp>;
  }

  /**
   * Upgrade an extension to the latest version
   * @summary Update extension
   * @param identity - Extension identity
   */
  @Security('X-Api-Token')
  @Post('{identity}/update')
  @SuccessResponse(200)
  public async updateExtension(@Path() identity: string): Promise<Result<void>> {
    return null as unknown as Result<void>;
  }
}
