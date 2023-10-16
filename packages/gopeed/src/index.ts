import { Events, Logger } from './extension';

interface Gopeed {
  events: Events;
  logger: Logger;
}

declare const gopeed: Gopeed;

export default gopeed;
