import { Reducer } from '../types';

/**
 * Given a dictionary of reducer functions creates a single reducer that once applied
 * will call each reducer with its corresponding value of the state as its first argument
 * and the event as its second.
 * @param reducers a dictionary (object) of key (place to store result of the reduction), value (reducer function to apply against current state and event)
 * @returns single reducer function, this may be useful when we want to pass an event as argument to multiple reducers
 *
 * @example
 * import { createEvent, createReducer } from 'reactive-actor';
 *
 * interface UsersState {
 *   auth: boolean;
 * }
 *
 * const userInitialState: UsersState = {
 *   auth: false,
 * };
 *
 * const authenticate = createEvent('[User] Authenticate');
 *
 * const userReducer = createReducer(userInitialState, (builder) =>
 *   builder.addCase(authenticate, (state) => ({ ...state, auth: true }))
 * );
 *
 * interface RepositoriesState {
 *   show: boolean;
 * }
 *
 * const repositoriesInitialState: RepositoriesState = {
 *   show: false,
 * };
 *
 * const toggleRepositories = createEvent('[Repositories] Toggle Repositories');
 *
 * const repositoriesReducer = createReducer(repositoriesInitialState, (builder) =>
 *   builder.addCase(toggleRepositories, (state) => ({
 *     ...state,
 *     show: !state.show,
 *   }))
 * );
 *
 * const reducer = combineReducers({
 *   users: userReducer,
 *   repositories: repositoriesReducer,
 * });
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
