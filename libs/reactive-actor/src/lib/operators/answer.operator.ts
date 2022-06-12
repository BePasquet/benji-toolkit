import { Observable, tap } from 'rxjs';
import { ActorRef, Event } from '../interfaces';

export function answer<T extends Event>(sender: ActorRef) {
  return (source$: Observable<T>) =>
    source$.pipe(tap((event) => sender.send(event)));
}
