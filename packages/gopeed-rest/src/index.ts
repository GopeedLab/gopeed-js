import type {
  Request,
  CreateTaskWithRequest,
  CreateTaskWithResolveResult,
  ResolveResult,
  Task,
  TaskStatus,
} from '@gopeed/types';

interface ClientOptions {
  host: string;
  token: string;
}

interface Result<T> {
  code: number;
  msg: string;
  data: T;
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
  public async resole(request: Request): Promise<ResolveResult> {
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
   * Get task list
   * @param statuses - Filter by task status
   * @returns
   */
  public async getTasks(statuses: TaskStatus[] = []): Promise<Task[]> {
    return this.doRequest<Task[]>('GET', '/api/v1/tasks', {
      query: {
        status: statuses.map((status) => `status=${status.toString()}`).join('&'),
      },
    });
  }

  /**
   * Pause a task
   * @param id - Task id
   */
  public async pauseTask(id: string): Promise<void> {
    await this.doRequest('PUT', `/api/v1/tasks/${id}/pause`);
  }

  /**
   * Continue a task
   * @param id - Task id
   */
  public async continueTask(id: string): Promise<void> {
    await this.doRequest('PUT', `/api/v1/tasks/${id}/continue`);
  }

  /**
   * Pause all tasks
   */
  public async pauseAllTasks(): Promise<void> {
    await this.doRequest('PUT', '/api/v1/tasks/pause');
  }

  /**
   * Continue all tasks
   */
  public async continueAllTasks(): Promise<void> {
    await this.doRequest('PUT', '/api/v1/tasks/continue');
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
   * Delete tasks
   * @param statuses - Filter by task status
   * @param force - Delete files
   */
  public async deleteTasks(statuses: TaskStatus[] = [], force = false): Promise<void> {
    await this.doRequest('DELETE', '/api/v1/tasks', {
      query: {
        status: statuses.map((status) => `status=${status.toString()}`).join('&'),
        force: force,
      },
    });
  }

  private async doRequest<T>(
    method: string,
    path: string,
    { query, data }: { query?: object; data?: object } = {}
  ): Promise<T> {
    let url = this.options.host + path;
    if (query) {
      const queryParams = Object.entries(query)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
        .join('&');
      url += `?${queryParams}`;
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
}

export { Client, ApiError };
export default Client;
