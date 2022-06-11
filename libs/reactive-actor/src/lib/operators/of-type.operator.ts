import { filter, Observable, OperatorFunction } from 'rxjs';
import { EventCreator } from '../interfaces.ts/event-creator.interface';
import { Action } from '../types';

export function ofType<T>(
  actionCreator: EventCreator<T>
): OperatorFunction<Action, ReturnType<EventCreator<T>>> {
  return (source$: Observable<Action>) =>
    source$.pipe(
      filter(({ type }) => type === actionCreator.type)
    ) as Observable<ReturnType<EventCreator<T>>>;
}
