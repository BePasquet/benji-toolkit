import { EventCreator } from '../interfaces.ts/event-creator.interface';

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
export function createEvent<T>(type: string): EventCreator<T> {
  const actionCreator = (payload: T) => ({ type, payload });
  // type added to function as property to allow read it as static property
  actionCreator.type = type;
  return actionCreator;
}
