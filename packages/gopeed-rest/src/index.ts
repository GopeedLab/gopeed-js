import type {
  Result,
  ServerInfo,
  CreateResolve,
  ResolveResult,
  CreateTaskWithRequest,
  CreateTaskWithResolveResult,
  CreateTaskBatch,
  PatchTask,
  Task,
  TaskStatus,
  TaskBtStats,
  TaskStats,
  DownloaderStoreConfig,
  Extension,
  InstallExtension,
  UpdateExtensionSettings,
  SwitchExtension,
  UpdateCheckExtensionResp,
} from '@gopeed/types';

interface ClientOptions {
  host: string;
  token: string;
}

class ApiError extends Error {
  code: number;
  msg: string;

  constructor(code: number, msg: string) {
    super(msg);
    this.code = code;
    this.msg = msg;
  }
}

class Client {
  private options: ClientOptions;

  constructor(options: ClientOptions = { host: 'http://127.0.0.1:9999', token: '' }) {
    this.options = options;
  }

  // ========== Info ==========

  /**
   * Get server info
   * @returns
   */
  public async getInfo(): Promise<ServerInfo> {
    return this.doRequest<ServerInfo>('GET', '/api/v1/info');
  }

  // ========== Resolve ==========

  /**
   * Resolve the download request
   * @param request - The request to create a new download task
   * @returns
   */
  public async resolve(request: CreateResolve): Promise<ResolveResult> {
    return this.doRequest<ResolveResult>('POST', '/api/v1/resolve', {
      data: request,
    });
  }

  // ========== Tasks ==========

  /**
   * Create a new download task
   * @param request - The request to create a new download task
   * @returns
   */
  public async createTask(request: CreateTaskWithResolveResult | CreateTaskWithRequest): Promise<string> {
    return this.doRequest<string>('POST', '/api/v1/tasks', {
      data: request,
    });
  }

  /**
   * Create a batch of download tasks
   * @param request - The request to create a batch of download tasks
   * @returns
   */
  public async createTaskBatch(request: CreateTaskBatch): Promise<string[]> {
    return this.doRequest<string[]>('POST', '/api/v1/tasks/batch', {
      data: request,
    });
  }

  /**
   * Patch an existing task (modify request or options).
   * For HTTP protocol, it can modify request info (URL, headers, etc.).
   * For BT protocol, it can modify selectFiles.
   * @param id - Task id
   * @param request - The patch request
   */
  public async patchTask(id: string, request: PatchTask): Promise<void> {
    await this.doRequest('PATCH', `/api/v1/tasks/${id}`, {
      data: request,
    });
  }

  /**
   * Get task info
   * @param id - Task id
   * @returns
   */
  public async getTask(id: string): Promise<Task> {
    return this.doRequest<Task>('GET', `/api/v1/tasks/${id}`);
  }

  /**
   * Get task list
   * @param id - Task id, can be multiple
   * @param status - Filter by task status, can be multiple
   * @param notStatus - Filter by excluding task status, can be multiple
   * @returns
   */
  public async getTasks(id: string[] = [], status: TaskStatus[] = [], notStatus: TaskStatus[] = []): Promise<Task[]> {
    return this.doRequest<Task[]>('GET', '/api/v1/tasks', {
      query: this.parseFilterParams(id, status, notStatus),
    });
  }

  /**
   * Get task stats
   * @param id - Task id
   * @returns
   */
  public async getTaskStats(id: string): Promise<TaskStats> {
    return this.doRequest<TaskBtStats>('GET', `/api/v1/tasks/${id}/stats`);
  }

  /**
   * Pause a task
   * @param id - Task id
   */
  public async pauseTask(id: string): Promise<void> {
    await this.doRequest('PUT', `/api/v1/tasks/${id}/pause`);
  }

  /**
   * Pause a batch of tasks
   * @param id - Task id, can be multiple
   * @param status - Filter by task status, can be multiple
   * @param notStatus - Filter by excluding task status, can be multiple
   */
  public async pauseTasks(id: string[] = [], status: TaskStatus[] = [], notStatus: TaskStatus[] = []): Promise<void> {
    await this.doRequest('PUT', '/api/v1/tasks/pause', {
      query: this.parseFilterParams(id, status, notStatus),
    });
  }

  /**
   * Continue a task
   * @param id - Task id
   */
  public async continueTask(id: string): Promise<void> {
    await this.doRequest('PUT', `/api/v1/tasks/${id}/continue`);
  }

  /**
   * Continue a batch of tasks
   * @param id - Task id, can be multiple
   * @param status - Filter by task status, can be multiple
   * @param notStatus - Filter by excluding task status, can be multiple
   */
  public async continueTasks(
    id: string[] = [],
    status: TaskStatus[] = [],
    notStatus: TaskStatus[] = []
  ): Promise<void> {
    await this.doRequest('PUT', '/api/v1/tasks/continue', {
      query: this.parseFilterParams(id, status, notStatus),
    });
  }

  /**
   * Delete a task
   * @param id - Task id
   * @param force - Delete files
   */
  public async deleteTask(id: string, force = false): Promise<void> {
    await this.doRequest('DELETE', `/api/v1/tasks/${id}?force=${force}`);
  }

  /**
   * Delete a batch of tasks
   * @param id - Task id, can be multiple
   * @param status - Filter by task status, can be multiple
   * @param notStatus - Filter by excluding task status, can be multiple
   * @param force - Delete files
   */
  public async deleteTasks(
    id: string[] = [],
    status: TaskStatus[] = [],
    notStatus: TaskStatus[] = [],
    force = false
  ): Promise<void> {
    const params = this.parseFilterParams(id, status, notStatus);
    params?.append('force', force.toString());
    await this.doRequest('DELETE', '/api/v1/tasks', {
      query: params,
    });
  }

  // ========== Config ==========

  /**
   * Get downloader configuration
   * @returns
   */
  public async getConfig(): Promise<DownloaderStoreConfig> {
    return this.doRequest<DownloaderStoreConfig>('GET', '/api/v1/config');
  }

  /**
   * Update downloader configuration
   * @param config - The new configuration
   */
  public async putConfig(config: DownloaderStoreConfig): Promise<void> {
    await this.doRequest('PUT', '/api/v1/config', {
      data: config,
    });
  }

  // ========== Extensions ==========

  /**
   * Install an extension from a Git URL or a local folder (dev mode)
   * @param request - Install request containing URL and optional devMode flag
   * @returns The identity of the installed extension
   */
  public async installExtension(request: InstallExtension): Promise<string> {
    return this.doRequest<string>('POST', '/api/v1/extensions', {
      data: request,
    });
  }

  /**
   * Get all installed extensions
   * @returns
   */
  public async getExtensions(): Promise<Extension[]> {
    return this.doRequest<Extension[]>('GET', '/api/v1/extensions');
  }

  /**
   * Get a single extension by identity
   * @param identity - Extension identity (e.g. "author@name")
   * @returns
   */
  public async getExtension(identity: string): Promise<Extension> {
    return this.doRequest<Extension>('GET', `/api/v1/extensions/${encodeURIComponent(identity)}`);
  }

  /**
   * Update settings of an extension
   * @param identity - Extension identity
   * @param settings - Key-value settings map
   */
  public async updateExtensionSettings(identity: string, settings: UpdateExtensionSettings): Promise<void> {
    await this.doRequest('PUT', `/api/v1/extensions/${encodeURIComponent(identity)}/settings`, {
      data: settings,
    });
  }

  /**
   * Enable or disable an extension
   * @param identity - Extension identity
   * @param status - true to enable, false to disable
   */
  public async switchExtension(identity: string, status: boolean): Promise<void> {
    const req: SwitchExtension = { status };
    await this.doRequest('PUT', `/api/v1/extensions/${encodeURIComponent(identity)}/switch`, {
      data: req,
    });
  }

  /**
   * Delete an extension
   * @param identity - Extension identity
   */
  public async deleteExtension(identity: string): Promise<void> {
    await this.doRequest('DELETE', `/api/v1/extensions/${encodeURIComponent(identity)}`);
  }

  /**
   * Check if a new version is available for an extension
   * @param identity - Extension identity
   * @returns Update check result containing newVersion (empty string if up-to-date)
   */
  public async updateCheckExtension(identity: string): Promise<UpdateCheckExtensionResp> {
    return this.doRequest<UpdateCheckExtensionResp>('GET', `/api/v1/extensions/${encodeURIComponent(identity)}/update`);
  }

  /**
   * Upgrade an extension to the latest version
   * @param identity - Extension identity
   */
  public async updateExtension(identity: string): Promise<void> {
    await this.doRequest('POST', `/api/v1/extensions/${encodeURIComponent(identity)}/update`);
  }

  // ========== Private ==========

  private async doRequest<T>(
    method: string,
    path: string,
    { query, data }: { query?: URLSearchParams; data?: object } = {}
  ): Promise<T> {
    let url = this.options.host + path;
    if (query) {
      url += `?${query.toString()}`;
    }
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.options.token) {
      headers['X-Api-Token'] = this.options.token;
    }
    try {
      const resp = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });
      if (resp.status !== 200) {
        throw new ApiError(1000, await resp.text());
      }
      const result = (await resp.json()) as Result<T>;
      if (result.code !== 0) {
        throw new ApiError(result.code, result.msg);
      }
      return result.data;
    } catch (error) {
      throw new ApiError(1000, (error as Error).message);
    }
  }

  private parseFilterParams(
    id: string[] = [],
    status: TaskStatus[] = [],
    notStatus: TaskStatus[] = []
  ): URLSearchParams | undefined {
    const params = new URLSearchParams();
    if (id.length > 0) {
      for (const taskId of id) {
        params.append('id', taskId);
      }
    }
    if (status.length > 0) {
      for (const taskStatus of status) {
        params.append('status', taskStatus.toString());
      }
    }
    if (notStatus.length > 0) {
      for (const taskStatus of notStatus) {
        params.append('notStatus', taskStatus.toString());
      }
    }
    if (params.toString() === '') {
      return undefined;
    }
    return params;
  }
}

export { Client, ApiError };
export default Client;
