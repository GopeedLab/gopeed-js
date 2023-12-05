/* eslint-disable no-unused-vars */
import { Request, Resource, Task } from '@gopeed/types';

export interface OnResovleContext {
  req: Request;
  res: Resource;
}

export interface OnStartContext {
  task: Task;
}

export type EventOnResolve = (ctx: OnResovleContext) => Promise<void> | void;
export type EventOnStart = (ctx: OnStartContext) => Promise<void> | void;

export interface Events {
  onResolve: (handler: EventOnResolve) => void;
  onStart: (handler: EventOnStart) => void;
}
