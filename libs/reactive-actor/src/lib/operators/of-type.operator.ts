import { filter, Observable, OperatorFunction } from 'rxjs';
import { Action, ActionCreator } from '../types';
import { EventCreatorReturnType } from '../util';

export function ofType<T>(
  actionCreator: ActionCreator<T>
): OperatorFunction<Action, ReturnType<EventCreatorReturnType<T>>> {
  return (source$: Observable<Action>) =>
    source$.pipe(
      filter(({ type }) => type === actionCreator.type)
    ) as Observable<ReturnType<EventCreatorReturnType<T>>>;
}
