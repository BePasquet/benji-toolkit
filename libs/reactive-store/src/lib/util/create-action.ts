import { ActionCreator } from '../types/action-creator.type';
/**
 * Utility function to generate action creators with specific type
 * @param type action identifier
 * @returns an action creator with the form of `(payload: T) => { type: string; payload: T }`
 * NOTE: type will be attached to action creator to give access to it from function as property
 * @example
 * import { createAction } from "from-reducer";
 *
 * // without payload
 * export const startLoader = createAction('START_LOADER');
 *
 * // with payload
 * export const getUser = createAction<{ name: string }>('GET_USER');
 *
 */
export function createAction<T>(type: string): ActionCreator<T> {
  const actionCreator = (payload: T = null) => ({ type, payload });
  // type added to function as property to allow read it as static property
  actionCreator.type = type;
  return actionCreator;
}
