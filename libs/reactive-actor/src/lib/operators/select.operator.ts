import { Observable, OperatorFunction } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

/**
 * A mapping operator that only emits when the next value changes
 * @param project a projection function `(value: T) => R`
 * @returns an observable which value will be the return value of the projection function
 */
export function select<T, R>(project: (value: T) => R): OperatorFunction<T, R> {
  return (source$: Observable<T>) =>
    source$.pipe(map(project), distinctUntilChanged());
}
