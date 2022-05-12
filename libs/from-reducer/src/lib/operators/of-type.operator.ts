import { filter, Observable, OperatorFunction } from 'rxjs';
import { Action, ActionCreator } from '../types';

export function ofType<T>(
  actionCreator: ActionCreator<T>
): OperatorFunction<Action, Action<T>> {
  return (source$: Observable<Action>) =>
    source$.pipe(
      filter(({ type }) => type === actionCreator.type)
    ) as Observable<Action<T>>;
}
