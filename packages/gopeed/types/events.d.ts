/* eslint-disable no-unused-vars */
import { Request, Resource, Task } from '@gopeed/types';

export interface OnResovleContext {
  req: Request;
  res: Resource;
}

export interface OnStartContext {
  task: Task;
}

export type EventOnResolve = (ctx: OnResovleContext) => void;
export type EventOnStart = (ctx: OnStartContext) => void;

export interface Events {
  onResolve: EventOnResolve;
  onStart: EventOnStart;
}
