/* eslint-disable no-unused-vars */
import { Request, Resource, Task } from '@gopeed/types';

export interface ExtensionRequest extends Request {
  /** Replaces all request labels. */
  setLabels(labels: Record<string, string>): Promise<void>;
  /** Sets a request label. */
  putLabel(key: string, value: string): Promise<void>;
  /** Removes a request label. */
  delLabel(key: string): Promise<void>;
}

export interface ExtensionTask extends Task {
  meta: Task['meta'] & {
    req: ExtensionRequest;
  };
  /**
   * Replaces the task request URL.
   */
  setUrl(url: string): Promise<void>;
}

export interface OnErrorExtensionTask extends ExtensionTask {
  /**
   * Continues the failed task.
   */
  continue(): Promise<void>;
}

export interface OnResolveContext {
  req: ExtensionRequest;
  res?: Resource;
}

/** @deprecated Use OnResolveContext instead. */
export type OnResovleContext = OnResolveContext;

export interface OnStartContext {
  task: ExtensionTask;
}

export interface OnErrorContext {
  task: OnErrorExtensionTask;
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
