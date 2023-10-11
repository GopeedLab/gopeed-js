gopeed.events.onResolve((ctx) => {
  ctx.res = {
    name: 'gopeed',
    files: [
      {
        name: 'test.txt',
        req: {
          url: 'https://example.com/test.txt',
        },
      },
    ],
  };
});
