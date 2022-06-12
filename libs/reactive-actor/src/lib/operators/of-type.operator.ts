import { filter, Observable, OperatorFunction } from 'rxjs';
import { EventCreator } from '../interfaces';
import { Action } from '../types';

export function ofType<T>(
  actionCreator: EventCreator<T>
): OperatorFunction<Action, ReturnType<EventCreator<T>>> {
  return (source$: Observable<Action>) =>
    source$.pipe(
      filter(({ type }) => type === actionCreator.type)
    ) as Observable<ReturnType<EventCreator<T>>>;
}
