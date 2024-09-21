import type {
  Result,
  Request,
  ResolveResult,
  CreateTaskWithRequest,
  CreateTaskWithResolveResult,
  CreateTaskBatch,
  Task,
  TaskStatus,
  TaskBtStats,
  TaskStats,
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

  /**
   * Resolve the download request
   * @param request - The request to create a new download task
   * @returns
   */
  public async resolve(request: Request): Promise<ResolveResult> {
    return this.doRequest<ResolveResult>('POST', '/api/v1/resolve', {
      data: request,
    });
  }

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
   *  @param id - Task id, can be multiple
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
    if (params.size === 0) {
      return undefined;
    }
    return params;
  }
}

export { Client, ApiError };
export default Client;
