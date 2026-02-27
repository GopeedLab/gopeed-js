/* eslint-disable no-unused-vars */
import { Request, Resource, Task } from '@gopeed/types';

export interface ExtensionTask extends Task {
  /**
   * Continue the task
   */
  continue(): void;
  /**
   * Pause the task
   */
  pause(): void;
}

export interface OnResovleContext {
  req: Request;
  res: Resource;
}

export interface OnStartContext {
  task: ExtensionTask;
}

export interface OnErrorContext {
  task: ExtensionTask;
  error: Error;
}

export interface OnDoneContext {
  task: ExtensionTask;
}

export type EventOnResolve = (ctx: OnResovleContext) => Promise<void> | void;
export type EventOnStart = (ctx: OnStartContext) => Promise<void> | void;
export type EventOnError = (ctx: OnErrorContext) => Promise<void> | void;
export type EventOnDone = (ctx: OnDoneContext) => Promise<void> | void;

export interface Events {
  onResolve: (handler: EventOnResolve) => void;
  onStart: (handler: EventOnStart) => void;
  onError: (handler: EventOnError) => void;
  onDone: (handler: EventOnDone) => void;
}
