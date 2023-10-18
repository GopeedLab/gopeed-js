/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { Request, Resource } from '@gopeed/types';

type Settings = { [key: string]: unknown };

interface Storage {
  /**
   * Returns the current value associated with the given key, or null if the given key does not exist.
   * @param key
   */
  get(key: string): string;
  /**
   * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
   * @param key
   * @param value
   */
  set(key: string, value: string): void;
  /**
   * Removes the key/value pair with the given key, if a key/value pair with the given key exists.
   * @param key
   */
  remove(key: string): void;
  /**
   * Removes all key/value pairs, if any, that match the given key.
   */
  clear(): void;
  /**
   * Returns all keys currently stored in the storage.
   */
  keys(): string[];
}

interface OnResovleContext {
  req: Request;
  res: Resource;
  settings: Settings;
  storage: Storage;
}

interface Events {
  onResolve(handler: (ctx: OnResovleContext) => void): void;
}

interface Logger {
  debug(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;
}

export { Events, Logger };
