import { ActorRef } from './actor-ref.interface';
import { Event } from './event.interface';

export interface SendConfig<T extends Event = Event> {
  sender?: ActorRef<T>;
}
