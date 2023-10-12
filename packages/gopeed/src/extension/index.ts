import { Request, Resource } from '@gopeed/types';

type Settings = { [key: string]: unknown };

interface OnResovleContext {
  req: Request;
  res: Resource;
  settings: Settings;
}

interface Events {
  // eslint-disable-next-line no-unused-vars
  onResolve(handler: (ctx: OnResovleContext) => void): void;
}

export { Events };
