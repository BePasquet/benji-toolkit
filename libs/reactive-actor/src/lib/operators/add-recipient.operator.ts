import { map, Observable, OperatorFunction } from 'rxjs';
import { ActorRef, AnswerConfig, Event } from '../interfaces';

export function addRecipient<T extends Event>(
  recipient: ActorRef<any>
): OperatorFunction<T, T & AnswerConfig> {
  return (source$: Observable<T>) =>
    source$.pipe(map((event) => ({ ...event, recipient })));
}
