import { Observable } from 'rxjs';

export type Epic<T, S> = (
  io$: Observable<T>,
  state?: Observable<S>
) => Observable<T>;
