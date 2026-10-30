# Gopeed JavaScript SDK 2.0.0

The extension declarations, request mutation types, and compatibility aliases are
delivered together in 2.0.0. The published SDK packages use the same version, and
new webpack extensions depend on `gopeed@^2.0.0`.

## Extension runtime declarations

Use `await` with storage operations. `storage.get()` may return `null` when a key
does not exist. Settings values are strings, numbers, booleans, null, or undefined.

`gopeed.runtime.blob` supports `Blob` sources and lazy stream opener functions,
including byte-range options. `gopeed.runtime.webview` describes page navigation,
JavaScript execution, element interactions, polling, cookies, and page cleanup.

## Request mutation

Use `task.meta.req` in `onStart` and `onError` to update URL, labels, HTTP method,
body, headers, or BT trackers. Protocol-specific methods do nothing for other
protocols. Request data is readonly in these mutation views; use the methods to
write changes.

```ts
gopeed.events.onError(async ({ task }) => {
  await task.meta.req.setUrl('https://example.com/refreshed.zip');
  await task.meta.req.putHeader('Authorization', 'Bearer new-token');
  await task.continue();
});
```

`continue()` is available only in `onError`. The declarations no longer advertise
the unsupported `pause()` method.

## Deprecated compatibility APIs

- `task.setUrl(url)` remains available in `onStart` and `onError`; prefer
  `task.meta.req.setUrl(url)`.
- Plain event request label methods `setLabels`, `putLabel`, and `delLabel` remain
  available in `onResolve` and `onDone`; prefer direct label edits there. The
  methods on `task.meta.req` in `onStart` and `onError` remain supported.
- `OnResovleContext` remains an alias of the correctly spelled `OnResolveContext`.
- `ExtensionTask`, `ExtensionRequest`, and `OnErrorExtensionTask` remain deprecated
  exports; prefer the event-specific mutation types or `LegacyRequest` as
  indicated by their deprecation comments.

These compatibility APIs are retained during 2.x. Removal belongs in a future
major release with migration notice. The matching host compatibility change is
GopeedLab/gopeed#1628; declarations alone do not restore APIs in an older host.
