export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE';
export type HttpHeaders = { [key: string]: string };

export interface HttpReqExtra {
  method?: HttpMethod;
  headers?: HttpHeaders;
  body?: string | undefined;
}

export interface BtReqExtra {
  /**
   * Tracker url list
   */
  trackers?: string[];
}

export interface HttpOptExtra {
  /**
   * Concurrent connections
   */
  connections?: number;
}

/**
 * Download request
 * @example {
 *  "url": "https://example.com/file.mp4"
 * }
 */
export interface Request {
  /**
   * Request url, support http(s) and magnet and local torrent file
   */
  url: string;
  extra?: HttpReqExtra | BtReqExtra;
}

export interface FileInfo {
  name: string;
  path: string;
  size: number;

  /**
   * Specify the request for this file
   */
  req?: Request;
}

/**
 * Resource info resloved from request, can contain multiple files
 */
export interface Resource {
  name: string;
  size: number;
  range: boolean;
  files: FileInfo[];
  hash?: string;
}

export interface ResolveResult {
  id: string;
  res: Resource;
}

/**
 * Download options
 */
export interface Options {
  /**
   * Specify the file name, if not set, use the name from resource
   */
  name?: string;
  /**
   * Specify the path to save the file, if not set, use the current directory
   */
  path?: string;
  /**
   * Select the index of the specified file, if not set, download all files
   */
  selectFiles?: number[];
  extra?: HttpOptExtra;
}

export type TaskStatus = 'ready' | 'running' | 'pause' | 'wait' | 'error' | 'done';

export interface TaskProgress {
  /**
   * Download used time(ns)
   */
  used: number;
  /**
   * Download speed(byte/s)
   */
  speed: number;
  /**
   * Downloaded size(byte)
   */
  downloaded: number;
}

export interface Task {
  id: string;
  /**
   * Task metadata
   */
  meta: {
    req: Request;
    res: Resource;
    opt: Options;
  };
  /**
   * Task status
   * @example "ready"
   * @example "running"
   */
  status: TaskStatus;
  progress: TaskProgress;
  /**
   * Task total size(byte)
   */
  size: number;
  /**
   * Task created time, ISO 8601 format
   * @example 2023-03-04T19:11:01.8468886+08:00
   */
  createdAt: string;
}

export interface CreateTaskWithResolveResult {
  /**
   * Resolved id, from resolved result
   */
  rid: string;
  /**
   * Download options
   */
  opt?: Options;
}

export interface CreateTaskWithRequest {
  /**
   * Download request
   */
  req: Request;
  /**
   * Download options
   */
  opt?: Options;
}
