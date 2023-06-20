import { ResolveResult } from '@gopeed/model';

interface ApiOptions {
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

class Api {
  private options: ApiOptions;

  constructor(options: ApiOptions) {
    this.options = options;
  }

  public async resole(request: Request): Promise<ResolveResult> {
    return await this.doRequest<ResolveResult>('POST', '/api/v1/resolve', {
      data: request,
    });
  }

  private async doRequest<T>(
    method: string,
    path: string,
    { query, data }: { query?: object; data?: object }
  ): Promise<T> {
    let url = this.options.host + path;
    if (query) {
      const queryParams = Object.entries(query)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
        .join('&');
      url += '?' + queryParams;
    }
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.options.token) {
      headers['X-Api-Token'] = this.options.token;
    }
    try {
      const resp = await fetch(url, {
        method: method,
        headers: headers,
        body: data ? JSON.stringify(data) : undefined,
      });
      if (resp.status !== 200) {
        throw new ApiError(1000, await resp.text());
      }
      return await resp.json();
    } catch (error) {
      throw new ApiError(1000, (error as Error).message);
    }
  }
}

export default Api;
