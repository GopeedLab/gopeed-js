/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { Request, Resource } from '@gopeed/types';

type Settings = { [key: string]: unknown };

interface OnResovleContext {
  req: Request;
  res: Resource;
  settings: Settings;
}

interface Events {
  onResolve(handler: (ctx: OnResovleContext) => void): void;
}

console.log();

interface Logger {
  debug(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;
}

export { Events, Logger };
