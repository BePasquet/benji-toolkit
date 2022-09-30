import { Event, SendConfig } from '../interfaces';

export type ActorEvent<T = unknown, SE extends Event = Event> = Event<T> &
  SendConfig<SE>;
