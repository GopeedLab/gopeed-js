import '../index';
import type { BlobOpener, Settings, WebviewPage } from '../index';

async function storageAndBlob(): Promise<void> {
  const settings: Settings = { text: 'test', number: 1, flag: true, empty: null };
  const token: string | null = await gopeed.storage.get('token');
  await gopeed.storage.set('token', token ?? String(settings.text));
  const keys: string[] = await gopeed.storage.keys();
  await gopeed.storage.remove(keys[0] ?? 'token');
  await gopeed.storage.clear();

  const opener: BlobOpener = async ({ offset, end }) => {
    const response = await fetch('https://example.com/file', {
      headers: { Range: `bytes=${offset}-${end >= 0 ? end : ''}` },
    });
    if (!response.body) throw new Error('No body');
    return response.body;
  };
  const url: string = await gopeed.runtime.blob.createObjectURL(opener, { size: 1024, range: true });
  await gopeed.runtime.blob.revokeObjectURL(url);
  await gopeed.runtime.blob.createObjectURL(new Blob(['test']));
  // @ts-expect-error Direct readable streams require an opener function.
  gopeed.runtime.blob.createObjectURL(new ReadableStream<Uint8Array>());
}

async function webview(): Promise<void> {
  if (!(await gopeed.runtime.webview.isAvailable())) return;
  const page: WebviewPage = await gopeed.runtime.webview.open({ headless: true, userAgent: 'test' });
  try {
    await page.addInitScript('window.ready = true');
    await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
    const title: string = await page.execute(() => document.title);
    const found: boolean = await page.waitForSelector('#download', { visible: true });
    const count: number | null = await page.waitForFunction(() => document.querySelectorAll('a').length);
    await page.focus('#search');
    await page.type('#search', title);
    if (found && count) await page.click('#download');
    await page.setCookie({ name: 'session', value: 'token', secure: true });
    const cookies = await page.getCookies();
    if (cookies[0]) await page.deleteCookie(cookies[0]);
    await page.clearCookies();
    const url: string = await page.url();
    const content: string = await page.content();
    gopeed.logger.info(url, content);
  } finally {
    await page.close();
  }
}
