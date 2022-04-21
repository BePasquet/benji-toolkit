import { Action, createAction, Reducer } from 'from-reducer';
import {
  BehaviorSubject,
  distinctUntilChanged,
  EMPTY,
  exhaustMap,
  filter,
  ignoreElements,
  interval,
  map,
  merge,
  mergeAll,
  Observable,
  scan,
  share,
  startWith,
  Subject,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';

export interface ActorRef<TEvent extends Action = Action> {
  send: (ev: TEvent) => void;
}

export interface AnswerActorPayload<
  TEvent extends Action = Action,
  TData = any
> {
  sender: ActorRef<TEvent>;
  data: TData;
}

export type ActionCreator<T> = {
  (payload?: T): {
    type: string;
    payload: T;
  };
  type: string;
};

export interface RxActorConfig<
  TState = any,
  TEvent = any,
  TExtendedState = any
> {
  stateReducer?: Reducer<TState, TEvent>;
  initialState?: TState;
  extendedStateReducer?: Reducer<TExtendedState, TEvent>;
  initialExtendedState?: TExtendedState;
}

export const answer = createAction<AnswerActorPayload>('[RX_ACTOR] Answer');

export const startActor = createAction('[RX_Actor] Start Actor');

export const stopActor = createAction('[RX_ACTOR] Stop Actor');

export function ofType<TActionCreator extends ActionCreator<any>>(
  actionCreator: TActionCreator
) {
  return (source$: Observable<Action>) =>
    source$.pipe(
      filter(({ type }) => type === actionCreator.type)
    ) as Observable<ReturnType<typeof actionCreator>>;
}

function compareObjects<T>(a: T, b: T): boolean {
  return Object.entries(a).every(([key, value]) => b[key] === value);
}

export function stateMachine<TState, TEvent>(
  reducer: Reducer<TState, TEvent>,
  initialState: TState
) {
  return (source$: Observable<TEvent>) =>
    source$.pipe(
      startWith({ type: '__RX_ACTOR_STATE_INIT__' }),
      scan(reducer, initialState),
      share({ connector: () => new BehaviorSubject(initialState) }),
      distinctUntilChanged(
        typeof initialState === 'object' ? compareObjects : (a, b) => a === b
      )
    );
}

export class RxActor<TEvent extends Event, TState, TExtendedState> {
  private readonly events$ = new Subject<TEvent>();

  readonly stateChanges$: Observable<TState>;

  readonly extendedStateChanges$: Observable<TExtendedState>;

  protected readonly receive$: Observable<[TEvent, TState, TExtendedState]>;

  private readonly answer$ = this.events$.pipe(
    ofType(answer),
    tap(({ payload: { sender, data } }) => sender.send(data))
  );

  private readonly addEffect$ = new Subject();

  constructor({
    stateReducer,
    initialState,
    extendedStateReducer,
    initialExtendedState,
  }: RxActorConfig = {}) {
    this.stateChanges$ =
      stateReducer && initialState
        ? this.events$.pipe(stateMachine(stateReducer, initialState))
        : EMPTY;

    this.extendedStateChanges$ =
      extendedStateReducer && initialExtendedState
        ? this.events$.pipe(
            stateMachine(extendedStateReducer, initialExtendedState)
          )
        : EMPTY;

    this.receive$ = this.events$
      .asObservable()
      .pipe(withLatestFrom(this.stateChanges$, this.extendedStateChanges$));

    const sendToSelf$ = this.addEffect$.pipe(
      mergeAll(),
      tap((ev) => this.send(ev))
    );

    const effects$ = merge(
      this.stateChanges$,
      this.extendedStateChanges$,
      this.answer$,
      sendToSelf$
    ).pipe(takeUntil(this.events$.pipe(ofType(stopActor))));

    effects$.subscribe();
  }

  addEffect(...effects: Observable<TEvent>[]): void {
    effects.forEach((effect) => this.addEffect$.next(effect));
  }

  send(ev: TEvent): void {
    this.events$.next(ev);
  }
}

export const connectWallet = createAction('[Wallet Actor] Connect Wallet');

export const connectWalletSuccess = createAction(
  '[Wallet Actor] Connect Wallet Success'
);

export const stopWallet = createAction('[Wallet Actor] Stop Wallet');

export enum WalletState {
  Online = 'ONLINE',
  Offline = 'OFFLINE',
}

export class WalletActor extends RxActor<any, any, any> {
  private readonly connectWallet$ = this.receive$.pipe(
    filter(([{ type }]) => type === connectWallet.type),
    exhaustMap(() =>
      interval(2000).pipe(
        take(1),
        map(() => connectWalletSuccess())
      )
    )
  );

  private readonly connectWalletSuccess$ = this.receive$.pipe(
    filter(([{ type }]) => type === connectWalletSuccess.type),
    tap((ev) => console.log(ev)),
    ignoreElements()
  );

  constructor(config: RxActorConfig = {}) {
    super(config);
    this.addEffect(this.connectWallet$, this.connectWalletSuccess$);
  }
}
