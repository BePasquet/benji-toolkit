import { BuilderFunction, Reducer } from '../types';
import { ActorEvent } from '../types/actor-event.type';
import { ReducerBuilder } from './reducer-builder.model';
/**
 * Utility function to create reducers
 * @param initialState reducer initial state
 * @param builderFunction a function that takes an instance of `ReducerBuilder<S>` as parameter to generate the reducer
 * @returns a reducer function
 * @example
 *
 * import { createEvent, createReducer } from 'reactive-actor';
 *
 * export interface LayoutState {
 *   loading: boolean;
 *   error: string;
 * }
 *
 * export const layoutInitialState: LayoutState = {
 *   loading: false,
 *   error: '',
 * };
 *
 * export const startLoader = createEvent('START_LOADER');
 *
 * export const stopLoader = createEvent('STOP_LOADER');
 *
 * export const layoutReducer = createReducer(layoutInitialState, (builder) =>
 *   builder
 *     .addCase(startLoader, (state) => ({ ...state, loading: true }))
 *     .addCase(stopLoader, (state) => ({ ...state, loading: false }))
 * );
 *
 */
export function createReducer<TState, TEvent extends ActorEvent = ActorEvent>(
  initialState: TState,
  builderFunction: BuilderFunction<TState>
): Reducer<TState, TEvent> {
  const { reducers } = builderFunction(new ReducerBuilder<TState>());

  return (state: TState = initialState, event: TEvent) => {
    const reducer = reducers.get(event.type);
    const newState = reducer ? reducer(state, event) : state;
    return newState;
  };
}
