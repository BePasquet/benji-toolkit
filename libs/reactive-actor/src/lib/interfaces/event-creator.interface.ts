import { ActorEvent } from '../types/actor-event.type';
import { ActorRef } from './actor-ref.interface';
import { Event } from './event.interface';

export interface EventCreator<T = unknown, SE extends ActorEvent = Event> {
  (payload: T, sender?: ActorRef<SE>): {
    type: string;
    payload: T;
    sender?: ActorRef<SE>;
  };
  type: string;
}
