import {
  BehaviorSubject,
  Observable,
  scan,
  share,
  startWith,
  Subject,
  Subscription,
} from 'rxjs';

export interface Message {
  type: string;
}

export type Reducer<TState, TEvent> = (state: TState, event: TEvent) => TState;

export class RxActor<TState, TMessage extends Message> {
  protected readonly receive$ = new Subject<TMessage>();

  protected readonly subscriptions = new Subscription();

  readonly onStateChange$: Observable<TState> = this.receive$.pipe(
    startWith({ type: '__INIT__' } as TMessage),
    scan(this.reducer, this.initialState),
    share({ connector: () => new BehaviorSubject(this.initialState) })
  );

  constructor(
    private readonly reducer: Reducer<TState, TMessage>,
    protected readonly initialState: TState
  ) {}

  send(message: TMessage): void {
    this.receive$.next(message);
  }

  stop() {
    this.subscriptions.unsubscribe();
  }
}
