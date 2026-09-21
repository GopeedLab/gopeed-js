/* eslint-disable no-unused-vars */
import { BtReqExtra, HttpMethod, HttpReqExtra, ReqExtra, Request, Resource, Task } from '@gopeed/types';

/** Request extra is read-only; use task.meta.req methods to modify it. */
export type ReadonlyExtra<T> = T extends object ? { readonly [K in keyof T]: ReadonlyExtra<T[K]> } : T;

export interface MutateTask<E extends ReqExtra = ReqExtra> extends Omit<Task, 'meta'> {
  meta: Omit<Task['meta'], 'req'> & {
    readonly req: MutateRequest<E>;
  };
}

/** Task request operations. Read request data through task.meta.req. */
export interface MutateRequest<E extends ReqExtra = ReqExtra>
  extends ReadonlyExtra<Omit<Request, 'extra'>> {
  /**
   * Replaces all request labels.
   * @example
   * ```ts
   * // Before: ctx.task.meta.req.labels = { source: 'old', tokenExpired: 'true' }
   * await ctx.task.meta.req.setLabels({ source: 'new' });
   * // After: ctx.task.meta.req.labels = { source: 'new' }
   * ```
   */
  setLabels(labels: Record<string, string>): Promise<void>;
  /**
   * Adds or replaces one request label, preserving other labels.
   * @example
   * ```ts
   * // Before: ctx.task.meta.req.labels = { source: 'extension', retry: '1' }
   * await ctx.task.meta.req.putLabel('retry', '2');
   * // After: ctx.task.meta.req.labels = { source: 'extension', retry: '2' }
   * ```
   */
  putLabel(key: string, value: string): Promise<void>;
  /**
   * Removes a request label. A missing key is a no-op.
   * @example
   * ```ts
   * // Before: ctx.task.meta.req.labels = { source: 'extension', retry: '2' }
   * await ctx.task.meta.req.delLabel('retry');
   * // After: ctx.task.meta.req.labels = { source: 'extension' }
   * ```
   */
  delLabel(key: string): Promise<void>;

  /** Optional protocol data. Methods initialize it when needed. */
  readonly extra?: ReadonlyExtra<E>;
  /**
   * Replaces the task request URL.
   * @example
   * ```ts
   * // Before: ctx.task.meta.req.url = 'https://example.com/old.zip'
   * await ctx.task.meta.req.setUrl('https://example.com/new.zip');
   * // After: ctx.task.meta.req.url = 'https://example.com/new.zip'
   * ```
   */
  setUrl(url: string): Promise<void>;
}

/** HTTP operations on the original task request. A type assertion does not change the protocol. */
export interface MutateHttpRequest extends MutateRequest<HttpReqExtra> {

  /**
   * Sets the HTTP method, preserving the body and headers.
   * Has no effect on non-HTTP tasks.
   * @example
   * ```ts
   * const req = ctx.task.meta.req as MutateHttpRequest;
   * // Before: ctx.task.meta.req.extra = { method: 'GET', header: { Accept: 'application/json' } }
   * await req.setMethod('POST');
   * // After: ctx.task.meta.req.extra = { method: 'POST', header: { Accept: 'application/json' } }
   * ```
   */
  setMethod(method: HttpMethod): Promise<void>;
  /**
   * Replaces the request body. An empty string clears it.
   * Has no effect on non-HTTP tasks.
   * @example
   * ```ts
   * const req = ctx.task.meta.req as MutateHttpRequest;
   * // Before: ctx.task.meta.req.extra = { method: 'POST', body: 'old' }
   * await req.setBody('new');
   * // After: ctx.task.meta.req.extra = { method: 'POST', body: 'new' }
   * ```
   */
  setBody(body: string): Promise<void>;
  /**
   * Replaces all headers, preserving the method and body. An empty object clears headers.
   * Has no effect on non-HTTP tasks.
   * Header names are canonicalized; duplicate names ignoring case are rejected.
   * @example
   * ```ts
   * const req = ctx.task.meta.req as MutateHttpRequest;
   * // Before: ctx.task.meta.req.extra = { method: 'POST', header: { Referer: 'https://example.com' } }
   * await req.setHeaders({ Authorization: 'Bearer new' });
   * // After: ctx.task.meta.req.extra = { method: 'POST', header: { Authorization: 'Bearer new' } }
   * ```
   */
  setHeaders(headers: Record<string, string>): Promise<void>;
  /**
   * Adds or replaces one header case-insensitively, preserving other fields.
   * Has no effect on non-HTTP tasks.
   * @example
   * ```ts
   * const req = ctx.task.meta.req as MutateHttpRequest;
   * // Before: ctx.task.meta.req.extra.header = { authorization: 'Bearer old', Accept: 'application/json' }
   * await req.putHeader('Authorization', 'Bearer new');
   * // After: ctx.task.meta.req.extra.header = { Authorization: 'Bearer new', Accept: 'application/json' }
   * ```
   */
  putHeader(name: string, value: string): Promise<void>;
  /**
   * Removes a header case-insensitively. A missing name is a no-op.
   * Has no effect on non-HTTP tasks.
   * @example
   * ```ts
   * const req = ctx.task.meta.req as MutateHttpRequest;
   * // Before: ctx.task.meta.req.extra.header = { Authorization: 'Bearer token', Accept: 'application/json' }
   * await req.delHeader('authorization');
   * // After: ctx.task.meta.req.extra.header = { Accept: 'application/json' }
   * ```
   */
  delHeader(name: string): Promise<void>;
}

/** BT operations on the original task request. A type assertion does not change the protocol. */
export interface MutateBtRequest extends MutateRequest<BtReqExtra> {

  /**
   * Replaces the tracker list instead of appending to it.
   * Has no effect on non-BT tasks.
   * @example
   * ```ts
   * const req = ctx.task.meta.req as MutateBtRequest;
   * // Before: ctx.task.meta.req.extra = { trackers: ['udp://old.example:80'] }
   * await req.setTrackers(['udp://new.example:80']);
   * // After: ctx.task.meta.req.extra = { trackers: ['udp://new.example:80'] }
   * ```
   */
  setTrackers(trackers: string[]): Promise<void>;
}

export interface MutateOnErrorTask<E extends ReqExtra = ReqExtra> extends MutateTask<E> {
  /**
   * Continues the failed task.
   */
  continue(): Promise<void>;
}

export interface OnResolveContext {
  req: Request;
  res?: Resource;
}

export interface OnStartContext {
  task: MutateTask;
}

export interface OnErrorContext {
  task: MutateOnErrorTask;
  error: Error;
}

export interface OnDoneContext {
  task: Task;
}

export type EventOnResolve = (ctx: OnResolveContext) => Promise<void> | void;
export type EventOnStart = (ctx: OnStartContext) => Promise<void> | void;
export type EventOnError = (ctx: OnErrorContext) => Promise<void> | void;
export type EventOnDone = (ctx: OnDoneContext) => Promise<void> | void;

export interface Events {
  onResolve: (handler: EventOnResolve) => void;
  onStart: (handler: EventOnStart) => void;
  onError: (handler: EventOnError) => void;
  onDone: (handler: EventOnDone) => void;
}
