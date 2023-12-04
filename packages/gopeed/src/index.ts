/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Events } from './event';

interface Info {
  identity: string;
  name: string;
  author: string;
  title: string;
  version: string;
}

interface Logger {
  debug(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;
}

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

interface Gopeed {
  /**
   * Register event handlers
   */
  events: Events;
  /**
   * Extension information
   */
  info: Info;
  /**
   * Extension logger
   */
  logger: Logger;
  /**
   * Extension settings
   */
  settings: Settings;
  /**
   * Extension storage
   */
  storage: Storage;
}

declare global {
  const gopeed: Gopeed;
}
