import { ActorRef } from './actor-ref.interface';
import { Event } from './event.interface';

export interface AnswerConfig<T extends Event = Event> {
  recipient?: ActorRef<T>;
}
