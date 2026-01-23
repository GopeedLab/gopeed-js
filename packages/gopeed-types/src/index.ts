export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE';
export type HttpHeader = { [key: string]: string };

/**
 * REST API result
 */
export interface Result<T> {
  /**
   * The response code, `0` means success, other values means error.
   */
  code: number;
  /**
   * The response message, if `code` != `0`, this field will contain error message.
   */
  msg: string;
  /**
   * The response data, if `code` == `0`, this field will contain response data.
   */
  data: T;
}

/**
 * Server info
 */
export interface ServerInfo {
  /**
   * Application version
   */
  version: string;
  /**
   * Go version
   */
  runtime: string;
  /**
   * OS version
   */
  os: string;
  /**
   * CPU architecture
   */
  arch: string;
  /**
   * Is running in docker
   */
  inDocker?: boolean;
}

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

export type ReqExtra = HttpReqExtra | BtReqExtra;

/**
 * HTTP download extra options
 * @example {
 *  "connections": 32
 * }
 */
export interface HttpOptsExtra {
  /**
   * Concurrent connections
   */
  connections?: number;
  /**
   * When task download complete, and it is a .torrent file, it will be auto create a new task for the torrent file
   */
  autoTorrent?: boolean;
}

export type OptsExtra = HttpOptsExtra;

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
  extra?: ReqExtra;
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
  extra?: OptsExtra;
}

export type Protocol = 'http' | 'bt';

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
  /**
   * Uploaded speed(bytes/s)
   */
  uploadSpeed: number;
  /**
   * Uploaded size(bytes)
   */
  uploaded: number;
}

export interface Task {
  /**
   * Task id
   */
  id: string;
  /**
   * Protocol type
   */
  protocol: Protocol;
  /**
   * Task display name
   */
  name: string;
  /**
   * Task metadata
   */
  meta: {
    req: Request;
    res: Resource;
    opts: Options;
  };
  /**
   * Task status
   * @example "ready"
   * @example "running"
   */
  status: TaskStatus;
  /**
   * Task is uploading
   */
  uploading: boolean;
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
   * @example "2023-03-04T19:11:01.8468886+08:00"
   */
  createdAt: string;
  /**
   * Task updated time, ISO 8601 format
   * @example "2023-03-04T19:11:01.8468886+08:00"
   */
  updatedAt: string;
}

/**
 * Torrent task stats
 */
export interface TaskBtStats {
  /**
   * Total peers
   */
  totalPeers: number;
  /**
   * Active peers
   */
  activePeers: number;
  /**
   * Connected seeders
   */
  connectedSeeders: number;
  /**
   * Total seed bytes
   */
  seedBytes: number;
  /**
   * Seed ratio
   * @example 0.1
   */
  seedRatio: number;
  /**
   * Total seed time(s)
   */
  seedTime: number;
}

export type TaskStats = TaskBtStats;

export interface CreateResolve {
  /**
   * Download request
   */
  req: Request;
  /**
   * Download options
   */
  opts?: Options;
}

export interface CreateTaskWithResolveResult {
  /**
   * Resolved id, from resolved result
   */
  rid: string;
  /**
   * Download options
   */
  opts?: Options;
}

export interface CreateTaskWithRequest {
  /**
   * Download request
   */
  req: Request;
  /**
   * Download options
   */
  opts?: Options;
}

export interface CreateTaskBatch {
  /**
   * Download request list
   */
  reqs: Request[];
  /**
   * Download options
   */
  opts?: Options;
}
