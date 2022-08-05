import { ActorRef, Event, EventCreator } from '../interfaces';
import { ActorEvent } from '../types/actor-event.type';

/**
 * Utility function to generate action creators with specific type
 * @param type action identifier
 * @returns an action creator with the form of `(payload: T) => { type: string; payload: T }`
 * NOTE: type will be attached to action creator to give access to it from function as property
 * @example
 * import { createEvent } from "reactive-actor";
 *
 * // without payload
 * export const startLoader = createEvent('START_LOADER');
 *
 * // with payload
 * export const getUser = createEvent<{ name: string }>('GET_USER');
 *
 */
export function createEvent<T, SM extends ActorEvent = Event>(
  type: string
): EventCreator<T, SM> {
  const actionCreator = (payload: T, sender?: ActorRef<SM>) => ({
    type,
    payload,
    sender,
  });
  // type added to function as property to allow read it as static property
  actionCreator.type = type;
  return actionCreator;
}
