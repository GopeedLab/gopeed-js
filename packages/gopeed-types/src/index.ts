export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE';
export type HttpHeader = { [key: string]: string };

/**
 * HTTP request extra options
 * @example {
 *  "method": "GET",
 *  "header": {
 *    "Cookie": "xxx"
 *  }
 * }
 */
export interface HttpReqExtra {
  /**
   * HTTP request method
   */
  method?: HttpMethod;
  /**
   * HTTP request header
   */
  header?: HttpHeader;
  /**
   * HTTP request body
   */
  body?: string | undefined;
}

/**
 * Bt request extra options
 * @example {
 *  "trackers": ["udp://tracker.opentrackr.org:1337/announce"]
 * }
 */
export interface BtReqExtra {
  /**
   * Tracker url list
   */
  trackers?: string[];
}

/**
 * HTTP download extra options
 * @example {
 *  "connections": 32
 * }
 */
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
  /**
   * Extra request options
   */
  extra?: HttpReqExtra | BtReqExtra;
  /**
   * Request labels
   */
  labels?: { [key: string]: string };
}

/**
 * File info
 * @example {
 *  "name": "file.mp4",
 *  "path": "",
 *  "size": 1024
 * }
 */
export interface FileInfo {
  /**
   * File name
   */
  name: string;
  /**
   * File path, relative to the resource, e.g. "path/to"
   */
  path: string;
  /**
   * File size(byte)
   */
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
  /**
   * When name is not blank, it means that the resource is a folder resource, and the name is the folder name
   */
  name: string;
  /**
   * Resource total size(byte)
   */
  size: number;
  /**
   * Whether the resource supports breakpoint continuation
   */
  range: boolean;
  /**
   * Resource files list, only when the resource is a folder resource will contain multiple files, otherwise it will only contain one file
   */
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
  /**
   * Download extra options
   */
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
  /**
   * Task id
   */
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
  /**
   * Task progress
   */
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
