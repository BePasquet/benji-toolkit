import { ActorEvent } from '../types/actor-event.type';
import { ActorRef } from './actor-ref.interface';

export interface EventCreator<T = unknown, SE extends ActorEvent = ActorEvent> {
  (payload: T, sender?: ActorRef<SE>): ActorEvent<T, SE>;
  type: string;
}
