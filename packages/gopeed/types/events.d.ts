/* eslint-disable no-unused-vars */
import { Request, Resource, Task } from '@gopeed/types';

interface OnResovleContext {
  req: Request;
  res: Resource;
}

interface OnStartContext {
  task: Task;
}

interface Events {
  onResolve(handler: (ctx: OnResovleContext) => void): void;
  onStart(handler: (ctx: OnStartContext) => void): void;
}

export { Events };
