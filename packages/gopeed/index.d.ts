/* eslint-disable no-unused-vars */
import { Events } from './types/events';

interface Info {
  identity: string;
  name: string;
  author: string;
  title: string;
  version: string;
}

interface Logger {
  debug(message?: unknown, ...optionalParams: unknown[]): void;
  info(message?: unknown, ...optionalParams: unknown[]): void;
  warn(message?: unknown, ...optionalParams: unknown[]): void;
  error(message?: unknown, ...optionalParams: unknown[]): void;
}

type Settings = {
  [key: string]: unknown;
};

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

/**
 * Global gopeed extension instance
 */
declare global {
  const gopeed: Gopeed;
}

export {};