export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE';
export type HttpHeader = { [key: string]: string };

/**
 * Response code
 */
export const RespCode = {
  Ok: 0,
  Error: 1000,
  Unauthorized: 1001,
  InvalidParam: 1002,
  TaskNotFound: 2001,
} as const;

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
 * Request proxy mode
 */
export type RequestProxyMode = 'follow' | 'none' | 'custom';

/**
 * Per-request proxy configuration
 */
export interface RequestProxy {
  /**
   * Proxy mode: follow global setting, none (no proxy), or custom
   */
  mode: RequestProxyMode;
  /**
   * Proxy scheme, e.g. "http", "socks5"
   */
  scheme?: string;
  /**
   * Proxy host, e.g. "127.0.0.1:1080"
   */
  host?: string;
  /**
   * Proxy username
   */
  usr?: string;
  /**
   * Proxy password
   */
  pwd?: string;
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
   * When task download complete, and it is a .torrent file, it will be auto create a new task for the torrent file.
   * null means use global config
   */
  autoTorrent?: boolean;
  /**
   * When true, deletes the .torrent file after creating BT task.
   * null means use global config
   */
  deleteTorrentAfterDownload?: boolean;
  /**
   * When task download complete, and it is an archive file, it will be auto extracted.
   * null means use global config
   */
  autoExtract?: boolean;
  /**
   * Password for extracting password-protected archives
   */
  archivePassword?: string;
  /**
   * When true, deletes the archive file after successful extraction
   */
  deleteAfterExtract?: boolean;
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
  /**
   * Per-request proxy configuration. If not set, uses global proxy settings
   */
  proxy?: RequestProxy;
  /**
   * Skip TLS certificate verification
   */
  skipVerifyCert?: boolean;
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
   * File creation time
   */
  ctime?: string;
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

/**
 * Archive extraction status
 */
export type ExtractStatus = '' | 'queued' | 'waitingParts' | 'extracting' | 'done' | 'error';

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
  /**
   * Archive extraction status
   */
  extractStatus?: ExtractStatus;
  /**
   * Archive extraction progress (0-100)
   */
  extractProgress?: number;
  /**
   * For multi-part archives: the base name used to group related parts
   */
  multiPartBaseName?: string;
  /**
   * For multi-part archives: part number (1-indexed)
   */
  multiPartNumber?: number;
  /**
   * For multi-part archives: whether this is the first part
   */
  multiPartIsFirst?: boolean;
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

// ===== HTTP Stats =====

/**
 * HTTP connection stats
 */
export interface HttpStatsConnection {
  downloaded: number;
  completed: boolean;
  failed: boolean;
  retryTimes: number;
}

/**
 * HTTP task stats
 */
export interface TaskHttpStats {
  connections: HttpStatsConnection[];
}

// ===== Patch Task =====

/**
 * Patch task request body (modify request or options of an existing task)
 */
export interface PatchTask {
  /**
   * New request info (HTTP protocol: modify URL/headers; BT: modify tracker etc.)
   */
  req?: Request;
  /**
   * New options (e.g. change selectFiles for BT task)
   */
  opts?: Options;
}

// ===== Config =====

/**
 * Proxy configuration for downloader
 */
export interface DownloaderProxyConfig {
  /**
   * Enable proxy
   */
  enable: boolean;
  /**
   * Use system proxy
   */
  system?: boolean;
  /**
   * Proxy scheme, e.g. "http", "socks5"
   */
  scheme?: string;
  /**
   * Proxy host, e.g. "127.0.0.1:1080"
   */
  host?: string;
  /**
   * Proxy username
   */
  usr?: string;
  /**
   * Proxy password
   */
  pwd?: string;
}

/**
 * Webhook configuration
 */
export interface WebhookConfig {
  /**
   * Enable webhooks
   */
  enable: boolean;
  /**
   * List of webhook URLs to call on download events
   */
  urls?: string[];
}

/**
 * Script execution configuration
 */
export interface ScriptConfig {
  /**
   * Enable script execution
   */
  enable: boolean;
  /**
   * List of script file paths to execute on download events
   */
  paths?: string[];
}

/**
 * Auto torrent task creation configuration
 */
export interface AutoTorrentConfig {
  /**
   * Enable automatic BT task creation when downloading .torrent files
   */
  enable: boolean;
  /**
   * Delete the .torrent file after BT task creation
   */
  deleteAfterDownload?: boolean;
}

/**
 * Archive extraction configuration
 */
export interface ArchiveConfig {
  /**
   * Enable automatic extraction of archives after download
   */
  autoExtract: boolean;
  /**
   * Delete the archive after successful extraction
   */
  deleteAfterExtract?: boolean;
}

/**
 * Downloader global configuration (storable)
 */
export interface DownloaderStoreConfig {
  /**
   * Default directory to save downloaded files
   */
  downloadDir?: string;
  /**
   * Maximum number of concurrent downloads
   */
  maxRunning?: number;
  /**
   * Protocol-specific configuration (keyed by protocol name, e.g. "http", "bt")
   */
  protocolConfig?: { [protocol: string]: unknown };
  /**
   * Extra configuration
   */
  extra?: { [key: string]: unknown };
  /**
   * Global proxy configuration
   */
  proxy?: DownloaderProxyConfig;
  /**
   * Webhook configuration
   */
  webhook?: WebhookConfig;
  /**
   * Script execution configuration
   */
  script?: ScriptConfig;
  /**
   * Auto torrent creation configuration
   */
  autoTorrent?: AutoTorrentConfig;
  /**
   * Archive extraction configuration
   */
  archive?: ArchiveConfig;
  /**
   * Automatically delete tasks whose files are missing on disk
   */
  autoDeleteMissingFileTasks?: boolean;
}

// ===== Extension =====

/**
 * Extension setting type
 */
export type SettingType = 'string' | 'number' | 'boolean';

/**
 * Extension setting option (for select-type settings)
 */
export interface ExtensionSettingOption {
  label: string;
  value: unknown;
}

/**
 * Extension setting definition
 */
export interface ExtensionSetting {
  name: string;
  title: string;
  description?: string;
  required?: boolean;
  type: SettingType;
  value?: unknown;
  options?: ExtensionSettingOption[];
}

/**
 * Extension script match rules
 */
export interface ExtensionMatch {
  /**
   * URL match patterns (Chrome extension match pattern format)
   */
  urls?: string[];
  /**
   * Label keys to match on requests
   */
  labels?: string[];
}

/**
 * Extension script definition
 */
export interface ExtensionScript {
  /**
   * Activation event name, e.g. "onResolve", "onStart", "onError", "onDone"
   */
  event: string;
  /**
   * Match rules
   */
  match?: ExtensionMatch;
  /**
   * Entry JS file path (relative to extension directory)
   */
  entry: string;
}

/**
 * Extension git repository info
 */
export interface ExtensionRepository {
  /**
   * Git repository URL
   */
  url: string;
  /**
   * Sub-directory within the repository (if extension is not at root)
   */
  directory?: string;
}

/**
 * Extension info
 */
export interface Extension {
  /**
   * Global unique identity, format: "author@name"
   */
  identity: string;
  name: string;
  author?: string;
  title: string;
  description?: string;
  icon?: string;
  /**
   * Semantic version, e.g. "1.0.0"
   */
  version: string;
  homepage?: string;
  repository?: ExtensionRepository;
  scripts?: ExtensionScript[];
  settings?: ExtensionSetting[];
  /**
   * Whether the extension is disabled
   */
  disabled?: boolean;
  /**
   * Whether the extension is running in dev mode
   */
  devMode?: boolean;
  /**
   * Local path for dev mode extensions
   */
  devPath?: string;
  /**
   * Created time, ISO 8601 format
   */
  createdAt?: string;
  /**
   * Updated time, ISO 8601 format
   */
  updatedAt?: string;
}

/**
 * Request body for installing an extension
 */
export interface InstallExtension {
  /**
   * Git URL or local path (dev mode)
   */
  url: string;
  /**
   * Enable dev mode (load from local folder)
   */
  devMode?: boolean;
}

/**
 * Request body for updating extension settings
 */
export interface UpdateExtensionSettings {
  /**
   * Settings key-value pairs
   */
  settings: { [key: string]: unknown };
}

/**
 * Request body for switching extension enabled/disabled
 */
export interface SwitchExtension {
  /**
   * true to enable, false to disable
   */
  status: boolean;
}

/**
 * Response body for checking extension update
 */
export interface UpdateCheckExtensionResp {
  /**
   * New version string, empty if already up-to-date
   */
  newVersion: string;
}
