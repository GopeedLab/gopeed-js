import { Request, Resource } from '@gopeed/model';

interface OnResovleContext {
  req: Request;
  res: Resource;
}

interface Hooks {
  // eslint-disable-next-line no-unused-vars
  onResovle(handler: (ctx: OnResovleContext) => void): void;
}

export default Hooks;
