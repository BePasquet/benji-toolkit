import {
  concatMap,
  MonoTypeOperatorFunction,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { PredicateFunction } from '../types';

export interface ValidateParams<T> {
  validation: PredicateFunction<T>;
  error?: string;
}

/**
 * Validates the source emitted value, throws an error when validation
 * doesn't pass
 * @param params -
 * - validation: predicate function to test emitted value
 * - error: message in case of error
 * @returns an operator function that validates emitted values
 */
export function validate<T>({
  validation,
  error = '',
}: ValidateParams<T>): MonoTypeOperatorFunction<T> {
  return (source$: Observable<T>) =>
    source$.pipe(
      concatMap((value) =>
        validation(value) ? of(value) : throwError(() => new Error(error))
      )
    );
}
