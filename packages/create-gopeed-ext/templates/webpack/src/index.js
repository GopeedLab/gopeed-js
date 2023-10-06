import gopeed from "gopeed";

gopeed.events.onResolve((ctx) => {
  ctx.res = {
    name: "gopeed",
    files: [
      {
        name: "test.txt",
        size: 1024,
      },
    ],
  };
});
