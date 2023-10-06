import { Request, Resource } from '@gopeed/types';

interface OnResovleContext {
  req: Request;
  res: Resource;
}

interface Events {
  // eslint-disable-next-line no-unused-vars
  onResolve(handler: (ctx: OnResovleContext) => void): void;
}

export default Events;
