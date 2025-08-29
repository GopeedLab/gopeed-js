/* eslint-disable no-unused-vars */
import { Events } from './types/events';

export interface Info {
  identity: string;
  name: string;
  author: string;
  title: string;
  version: string;
}

export interface Logger {
  debug(message?: unknown, ...optionalParams: unknown[]): void;
  info(message?: unknown, ...optionalParams: unknown[]): void;
  warn(message?: unknown, ...optionalParams: unknown[]): void;
  error(message?: unknown, ...optionalParams: unknown[]): void;
}

export type Settings = {
  [key: string]: unknown;
};

export interface Storage {
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

export interface Gopeed {
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

export type MessageError = Error;

export interface MessageErrorConstructor {
  new (message?: string): MessageError;
  (message?: string): MessageError;
}

export type Fingerprint =
  /** No browser fingerprint simulation - use default TLS settings */
  | 'none'
  /** Simulate Chrome browser TLS fingerprint and headers */
  | 'chrome'
  /** Simulate Firefox browser TLS fingerprint and headers */
  | 'firefox'
  /** Simulate Safari browser TLS fingerprint and headers */
  | 'safari';

/**
 * Global gopeed extension instance
 */
declare global {
  const gopeed: Gopeed;
  const MessageError: MessageErrorConstructor;

  /**
   * Set browser fingerprint for HTTP requests
   * This function configures the TLS fingerprint and User-Agent headers to simulate different browsers
   *
   * @param fingerprint - The browser fingerprint type to simulate
   *
   * @example
   * ```typescript
   * // Simulate Chrome browser
   * __gopeed_setFingerprint('chrome');
   *
   * // Use default settings (no simulation)
   * __gopeed_setFingerprint('none');
   * ```
   */
  function __gopeed_setFingerprint(fingerprint: Fingerprint): void;
}

export * from './types/events';
export {};
