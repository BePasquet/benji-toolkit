import { Event } from './event.interface';

export interface ActorRef<T extends Event = Event> {
  send: (message: T) => void;
}
