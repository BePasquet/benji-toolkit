import { Actor } from '../models';
import { ActorEvent } from '../types/actor-event.type';


export type ActorRef<T extends ActorEvent> = Pick<Actor<T>, 'send'>
