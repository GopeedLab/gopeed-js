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
  [key: string]: string | number | boolean | null | undefined;
};

export interface Storage {
  /**
   * Returns the current value associated with the given key, or null if the given key does not exist.
   * @param key
   */
  get(key: string): Promise<string | null>;
  /**
   * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
   * @param key
   * @param value
   */
  set(key: string, value: string): Promise<void>;
  /**
   * Removes the key/value pair with the given key, if a key/value pair with the given key exists.
   * @param key
   */
  remove(key: string): Promise<void>;
  /**
   * Removes all key/value pairs, if any, that match the given key.
   */
  clear(): Promise<void>;
  /**
   * Returns all keys currently stored in the storage.
   */
  keys(): Promise<string[]>;
}

export interface BlobOpenRequest {
  /** Inclusive byte offset. */
  offset: number;
  /** Inclusive end offset, or -1 when no end offset was requested. */
  end: number;
}

export type BlobOpener = (request: BlobOpenRequest) => ReadableStream<Uint8Array> | Promise<ReadableStream<Uint8Array>>;

export interface BlobObjectURLOptions {
  /** MIME type exposed by the blob transport. */
  contentType?: string;
  /** Total source size in bytes. Required when range is true. */
  size?: number;
  /** Whether the source supports byte-range requests. */
  range?: boolean;
}

export interface RuntimeBlob {
  /**
   * Creates a URL backed by a Blob or a lazily opened readable stream.
   *
   * @example Create a range-aware streaming URL
   * ```typescript
   * const sourceUrl = 'https://example.com/archive.zip';
   * const size = 1024;
   * const url = await gopeed.runtime.blob.createObjectURL(
   *   async ({ offset, end }) => {
   *     const rangeEnd = end >= 0 ? end : '';
   *     const response = await fetch(sourceUrl, {
   *       headers: { Range: `bytes=${offset}-${rangeEnd}` },
   *     });
   *     if (!response.body) {
   *       throw new Error('Response body is empty');
   *     }
   *     return response.body;
   *   },
   *   {
   *     contentType: 'application/zip',
   *     size,
   *     range: true,
   *   },
   * );
   * ```
   */
  createObjectURL(source: Blob | BlobOpener, options?: BlobObjectURLOptions): Promise<string>;
  /** Revokes a URL previously returned by createObjectURL. */
  revokeObjectURL(url: string): Promise<void>;
}

/** Options used when opening a WebView page. */
export interface WebviewOpenOptions {
  /** Opens the page without displaying a window. */
  headless?: boolean;
  /** Enables the WebView debugging facilities when supported by the host. */
  debug?: boolean;
  /** Window title used for a visible WebView. */
  title?: string;
  /** Initial window width in logical pixels. */
  width?: number;
  /** Initial window height in logical pixels. */
  height?: number;
  /** User-Agent used by the page. */
  userAgent?: string;
}

/** Options controlling WebView navigation. */
export interface WebviewGotoOptions {
  /** Maximum navigation time in milliseconds. */
  timeoutMs?: number;
  /** Page lifecycle event to wait for before resolving. */
  waitUntil?: 'load' | 'domcontentloaded';
}

/** Options controlling element clicks. */
export interface WebviewClickOptions {
  /** Delay in milliseconds before clicking the element. */
  delay?: number;
}

/** Options controlling text input. */
export interface WebviewTypeOptions {
  /** Delay in milliseconds between entered characters. */
  delay?: number;
}

/** Common options for polling WebView conditions. */
export interface WebviewWaitOptions {
  /** Maximum wait time in milliseconds. Defaults to 10000. */
  timeoutMs?: number;
  /** Interval between condition checks in milliseconds. Defaults to 100. */
  pollIntervalMs?: number;
}

/** Options controlling selector state matching. */
export interface WebviewWaitForSelectorOptions extends WebviewWaitOptions {
  /** Waits until the matched element is visible. */
  visible?: boolean;
  /** Waits until the element is absent or hidden. */
  hidden?: boolean;
}

/** Cookie data exchanged with a WebView page. */
export interface WebviewCookie {
  /** Cookie name. */
  name: string;
  /** Cookie value. */
  value: string;
  /** Cookie domain. */
  domain?: string;
  /** Cookie path. */
  path?: string;
  /** Expiration as an RFC 3339 string, Unix timestamp in milliseconds, or Date. */
  expires?: string | number | Date;
  /** Restricts the cookie to secure connections. */
  secure?: boolean;
  /** Prevents client-side page scripts from reading the cookie. */
  httpOnly?: boolean;
}

/** JavaScript source or a function that can be evaluated in the WebView page. */
export type WebviewExecutable<T = unknown> = string | ((...args: unknown[]) => T | Promise<T>);

/** A page opened through the extension WebView runtime. */
export interface WebviewPage {
  /**
   * Registers JavaScript to run before page scripts on subsequent navigations.
   * @param script JavaScript source to inject.
   */
  addInitScript(script: string): Promise<void>;
  /**
   * Navigates the page and waits for the configured lifecycle event.
   * @param url Destination URL.
   * @param options Navigation and timeout options.
   */
  goto(url: string, options?: WebviewGotoOptions): Promise<void>;
  /**
   * Evaluates JavaScript in the page and returns its serializable result.
   * @param scriptOrFn JavaScript source or a function to invoke.
   * @param args Arguments passed to the evaluated function.
   *
   * @example
   * ```typescript
   * const pageInfo = await page.execute(() => ({
   *   title: document.title,
   *   url: location.href,
   * }));
   * ```
   */
  execute<T = unknown>(scriptOrFn: WebviewExecutable<T>, ...args: unknown[]): Promise<T>;
  /** Focuses the element matching the selector. */
  focus(selector: string): Promise<void>;
  /** Clicks the element matching the selector. */
  click(selector: string, options?: WebviewClickOptions): Promise<void>;
  /** Appends text to an input, textarea, or content-editable element. */
  type(selector: string, text: string, options?: WebviewTypeOptions): Promise<void>;
  /**
   * Waits for a selector to satisfy the requested state.
   * @returns true when matched, or false when the timeout expires.
   *
   * @example
   * ```typescript
   * const found = await page.waitForSelector('#download-button', {
   *   visible: true,
   *   timeoutMs: 5_000,
   * });
   * if (!found) {
   *   throw new Error('Download button did not appear');
   * }
   * ```
   */
  waitForSelector(selector: string, options?: WebviewWaitForSelectorOptions): Promise<boolean>;
  /**
   * Polls an expression or function until it returns a truthy value.
   * A WebviewWaitOptions object may be supplied as the first argument.
   * @returns The matched value, or null when the timeout expires.
   *
   * @example
   * ```typescript
   * const itemCount = await page.waitForFunction(
   *   () => document.querySelectorAll('.result-item').length,
   *   { timeoutMs: 10_000, pollIntervalMs: 200 },
   * );
   * ```
   */
  waitForFunction<T = unknown>(scriptOrFn: WebviewExecutable<T>, ...args: unknown[]): Promise<T | null>;
  /** Returns all cookies visible to the page. */
  getCookies(): Promise<WebviewCookie[]>;
  /**
   * Creates or updates a page cookie.
   *
   * @example
   * ```typescript
   * await page.setCookie({
   *   name: 'session',
   *   value: 'token',
   *   domain: 'example.com',
   *   path: '/',
   *   secure: true,
   *   httpOnly: true,
   * });
   * ```
   */
  setCookie(cookie: WebviewCookie): Promise<void>;
  /** Deletes the matching page cookie. */
  deleteCookie(cookie: WebviewCookie): Promise<void>;
  /** Deletes all page cookies. */
  clearCookies(): Promise<void>;
  /** Returns the current page URL. */
  url(): Promise<string>;
  /** Returns the serialized outer HTML of the current document. */
  content(): Promise<string>;
  /** Closes the page and releases its host resources. */
  close(): Promise<void>;
}

/** Extension WebView runtime capabilities. */
export interface RuntimeWebview {
  /** Returns whether the current host can open WebView pages. */
  isAvailable(): Promise<boolean>;
  /**
   * Opens a WebView page.
   *
   * @example
   * ```typescript
   * if (await gopeed.runtime.webview.isAvailable()) {
   *   const page = await gopeed.runtime.webview.open({ headless: true });
   *   try {
   *     await page.goto('https://example.com', {
   *       waitUntil: 'domcontentloaded',
   *       timeoutMs: 15_000,
   *     });
   *     const title = await page.execute(() => document.title);
   *     gopeed.logger.info('Page title:', title);
   *   } finally {
   *     await page.close();
   *   }
   * }
   * ```
   */
  open(options?: WebviewOpenOptions): Promise<WebviewPage>;
}

export interface Runtime {
  /** Blob-backed transport capabilities. */
  blob: RuntimeBlob;
  /** WebView automation capabilities. */
  webview: RuntimeWebview;
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
  /**
   * Extension runtime capabilities
   */
  runtime: Runtime;
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
