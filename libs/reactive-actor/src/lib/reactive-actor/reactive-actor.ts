import {
  BehaviorSubject,
  merge,
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import { retry, scan, share, startWith, tap } from 'rxjs/operators';
import { Epic, Reducer } from '../types';

export class ReactiveActor<S, T> {
  readonly state$: Observable<S>;

  private readonly events$ = new Subject<T>();

  private readonly epics$: Observable<T>;

  private readonly effects$: Observable<any>;

  private readonly subscriptions = new Subscription();

  /**
   * @param reducer a reducer function that will be call every time an event happen
   * @param initialState an initial state for the reducer
   */
  constructor(reducer: Reducer<S, T>, initialState: S, epics: Epic<T, S>[]) {
    this.state$ = this.events$.pipe(
      startWith({ type: '__INIT__' }),
      scan(reducer, initialState),
      share({ connector: () => new BehaviorSubject(initialState) })
    );

    const epicObs = epics.map((fn) => fn(this.events$, this.state$));

    this.epics$ = merge(...epicObs).pipe(
      tap((action) => this.send(action)),
      retry()
    );

    this.effects$ = merge(this.state$, this.epics$);
  }

  start(): void {
    this.subscriptions.add(this.effects$.subscribe());
  }

  stop(): void {
    this.subscriptions.unsubscribe();
  }

  send(event: T): void {
    this.events$.next(event);
  }
}
