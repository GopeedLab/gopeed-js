import Hooks from './extension';

interface Gopeed {
  hooks: Hooks;
}

declare global {
  const gopeed: Gopeed;
}
