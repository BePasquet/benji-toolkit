import { ActorRef } from './actor-ref.interface';

export interface EventCreator<T> {
  (payload: T, sender?: ActorRef): {
    type: string;
    payload: T;
    sender?: ActorRef;
  };
  type: string;
}
