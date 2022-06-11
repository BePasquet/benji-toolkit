import { Action, BuilderFunction, Reducer } from '../types';
import { ReducerBuilder } from './reducer-builder.model';
/**
 * Utility function to create reducers
 * @param initialState reducer initial state
 * @param builderFunction a function that takes an instance of `ReducerBuilder<S>` as parameter to generate the reducer
 * @returns a reducer function
 * @example
 *
 * import { createEvent, createReducer } from 'from-reducer';
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
export function createReducer<S, A extends Action = Action>(
  initialState: S,
  builderFunction: BuilderFunction<S>
): Reducer<S, A> {
  const { reducers } = builderFunction(new ReducerBuilder<S>());

  return (state: S = initialState, action: A) => {
    const reducer = reducers.get(action.type);
    const newState = reducer ? reducer(state, action) : state;
    return newState;
  };
}
