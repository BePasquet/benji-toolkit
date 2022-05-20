import {
  BehaviorSubject,
  merge,
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import { retry, scan, share, startWith, tap } from 'rxjs/operators';
import { Epic, Reducer } from '../types';

export interface ReactiveActorParams<TState, TEvent> {
  reducer: Reducer<TState, TEvent>;
  initialState: TState;
  epics: Epic<TEvent, TState>[];
}

export class ReactiveActor<TState, TEvent> {
  readonly state$: Observable<TState>;

  private readonly events$ = new Subject<TEvent>();

  private readonly epics$: Observable<TEvent>;

  private readonly effects$: Observable<any>;

  private readonly subscriptions = new Subscription();

  /**
   * @param reducer a reducer function that will be call every time an event happen
   * @param initialState an initial state for the reducer
   */
  constructor({
    reducer,
    initialState,
    epics,
  }: ReactiveActorParams<TState, TEvent>) {
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

  send(event: TEvent): void {
    this.events$.next(event);
  }
}
