import Hooks from './extension';

interface Gopeed {
  hooks: Hooks;
}

declare const gopeed: Gopeed;

export const { hooks } = gopeed;
export default gopeed;
