import { Action, Reducer } from '../types';
import { createAction } from './create-action';

/**
 * Model to create reducers
 */
export class ReducerBuilder<S> {
  /**
   * Keeps track of reducers
   */
  private readonly state = new Map<string, Reducer<S, Action>>();

  /**
   * Adds a case to the reducer to match a particular type
   * @param typeOrHasType a string or an object / function containing a type property
   * @param reducer a reducer function with the form of `(state: S, action: Action) => S`
   * @returns the current reducer builder instance (allows chaining)
   */
  addCase<A extends ReturnType<typeof createAction>>(
    typeOrHasType: A | string,
    reducer: Reducer<S, ReturnType<A>>
  ) {
    const type =
      typeof typeOrHasType === 'string' ? typeOrHasType : typeOrHasType.type;

    this.state.set(type, reducer);
    return this;
  }

  /**
   * Immutable reducers instance
   */
  get reducers() {
    return new Map(this.state);
  }
}
