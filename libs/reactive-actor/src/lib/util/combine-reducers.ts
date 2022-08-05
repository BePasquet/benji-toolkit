import { Reducer } from '../types';

/**
 * Given a dictionary of reducer functions creates a single reducer that once applied
 * will call each reducer with its corresponding value of the state as its first argument
 * and the event as its second.
 * @param reducers a dictionary (object) of key (place to store result of the reduction), value (reducer function to apply against current state and event)
 * @returns single reducer function, this may be useful when we want to pass an event as argument to multiple reducers
 *
 * @example
 * import { Event } from 'reactive-actor';
 *
 * interface UsersState {
 *   auth: boolean;
 * }
 *
 * const userReducer = (state: UsersState, action: Event) => {
 *   switch (action.type) {
 *     case 'AUTHENTICATE': {
 *       return { auth: true };
 *     }
 *
 *     default: {
 *       return state;
 *     }
 *   }
 * };
 *
 * interface ProductsState {
 *   show: boolean;
 * }
 *
 * const productsReducer = (state: ProductsState, action: Event) => {
 *   switch (action.type) {
 *     case 'TOGGLE_PRODUCTS': {
 *       return { ...state, show: !state.show };
 *     }
 *
 *     default: {
 *       return state;
 *     }
 *   }
 * };
 *
 * const reducers = {
 *   users: userReducer,
 *   products: productsReducer,
 * };
 *
 * const reducer = combineReducers(reducers);
 *
 */
export function combineReducers<
  S extends Record<K, S[K]>,
  T,
  K extends keyof S
>(reducers: Record<K, Reducer<S[K], T>>): Reducer<S, T> {
  const rs = Object.entries<Reducer<S[K], T>>(reducers);

  return (state: S, event: T) =>
    rs.reduce(
      (s, [key, reducer]) => ({
        ...s,
        [key]: reducer(s[key as K], event),
      }),
      state
    );
}
