import { EventCreator } from '../interfaces';
import { Reducer } from '../types';
import { ActorEvent } from '../types/actor-event.type';

/**
 * Model to create reducers
 */
export class ReducerBuilder<S> {
  /**
   * Keeps track of reducers
   */
  private readonly state = new Map<string, Reducer<S, ActorEvent<any>>>();

  /**
   * Adds a case to the reducer to match a particular type
   * @param typeOrHasType a string or object / function containing a type property
   * @param reducer a reducer function with the form of `(state: S, event: Event) => S`
   * @returns the current reducer builder instance (allows chaining)
   */
  addCase<T>(
    typeOrHasType: EventCreator<T> | EventCreator<T>[] | string | string[],
    reducer: Reducer<S, ActorEvent<T>>
  ) {
    const events = Array.isArray(typeOrHasType)
      ? typeOrHasType
      : [typeOrHasType];

    for (const event of events) {
      const key = typeof event === 'string' ? event : event.type;
      this.state.set(key, reducer);
    }

    return this;
  }

  /**
   * Immutable reducers instance
   */
  get reducers(): Map<string, Reducer<S, ActorEvent<any>>> {
    return new Map(this.state);
  }
}
