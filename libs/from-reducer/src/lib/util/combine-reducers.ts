import { Reducer } from '../types';

export function combineReducers<
  S extends Record<K, S[K]>,
  T,
  K extends keyof S
>(reducers: Record<K, Reducer<S[K], T>>): Reducer<S, T> {
  return (gState: S, value: T) =>
    Object.entries<Reducer<S[K], T>>(reducers).reduce(
      (state, [key, reducer]) => ({
        ...state,
        [key as K]: reducer(state[key as K], value),
      }),
      gState
    );
}
