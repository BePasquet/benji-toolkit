import { ActorEvent } from '../types/actor-event.type';
import { ActorRef } from './actor-ref.interface';

export interface SyntheticEvent<T = unknown, SE extends ActorEvent = Event> {
  type: string;
  payload: T;
  sender?: ActorRef<SE>;
}
