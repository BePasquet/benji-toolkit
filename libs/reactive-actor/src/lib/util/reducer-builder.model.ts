import { EventCreator } from '../interfaces';
import { Action, Reducer } from '../types';

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
   * @param typeOrHasType a string or object / function containing a type property
   * @param reducer a reducer function with the form of `(state: S, action: Action) => S`
   * @returns the current reducer builder instance (allows chaining)
   */
  addCase<T>(
    typeOrHasType: EventCreator<T> | EventCreator<T>[] | string | string[],
    reducer: Reducer<S, ReturnType<EventCreator<T>>>
  ) {
    const actions = Array.isArray(typeOrHasType)
      ? typeOrHasType
      : [typeOrHasType];

    for (const action of actions) {
      const key = typeof action === 'string' ? action : action.type;
      this.state.set(key, reducer);
    }

    return this;
  }

  /**
   * Immutable reducers instance
   */
  get reducers() {
    return new Map(this.state);
  }
}
