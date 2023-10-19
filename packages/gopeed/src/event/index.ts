/* eslint-disable @typescript-eslint/no-explicit-any */
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
  onResolve: (context: OnResovleContext) => void;
  onStart: (context: OnStartContext) => void;
}

export { Events };
