import '../index';
import type { ExtensionTask, MutateOnErrorTask, MutateTask, OnResovleContext, OnResolveContext } from '../types/events';
import type { Request } from '@gopeed/types';

// Shared REST/resource request data must still accept plain object literals.
const request: Request = { url: 'https://example.com/file', labels: { source: 'test' } };

const legacyResolveHandler = async (ctx: OnResovleContext): Promise<void> => {
  const correctlySpelled: OnResolveContext = ctx;
  await correctlySpelled.req.setLabels({ source: 'legacy' });
  await ctx.req.putLabel('retry', '1');
  await ctx.req.delLabel('retry');
  ctx.req.labels = { source: 'new' };
};
gopeed.events.onResolve(legacyResolveHandler);

gopeed.events.onStart(async ({ task }) => {
  const current: MutateTask = task;
  await current.setUrl(request.url);
  await task.meta.req.setUrl(request.url);
  // The modern methods remain available and are not deprecated aliases.
  await task.meta.req.setLabels({ source: 'new' });
  await task.meta.req.putHeader('Authorization', 'Bearer token');
  await task.meta.req.setTrackers(['udp://tracker.example.com']);
  // @ts-expect-error continue remains exclusive to onError.
  task.continue();
  // @ts-expect-error pause is not a supported runtime method.
  task.pause();
  // @ts-expect-error request data remains readonly on mutation views.
  task.meta.req.url = request.url;
});

gopeed.events.onError(async ({ task }) => {
  const legacy: ExtensionTask = task;
  const current: MutateOnErrorTask = legacy;
  await legacy.setUrl(request.url);
  await current.meta.req.setUrl(request.url);
  await legacy.continue();
});

gopeed.events.onDone(async ({ task }) => {
  await task.meta.req.setLabels({ source: 'legacy' });
  await task.meta.req.putLabel('done', 'true');
  await task.meta.req.delLabel('source');
  // @ts-expect-error task-level setUrl was never available in onDone.
  task.setUrl(request.url);
  // @ts-expect-error continue remains exclusive to onError.
  task.continue();
});
