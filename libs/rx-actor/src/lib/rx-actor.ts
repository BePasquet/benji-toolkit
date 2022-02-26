import { createAction, createReducer } from 'from-reducer';
import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  of,
  scan,
  share,
  startWith,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';

export interface TransactionResponse {
  data: any[];
}

export interface DateRange {
  from: string;
  to: string;
}

export interface TransactionFilter {
  table: string;
  period: 'day' | 'week' | 'month';
  type: string;
  date: DateRange;
}

export const getTransactions = createAction<TransactionFilter>(
  '[Transactions] Get Transactions'
);

export const getTransactionsSuccess = createAction<TransactionResponse>(
  '[Transactions] Get Transactions Success'
);

export const getTransactionsFail = createAction<string>(
  '[Transactions] Get Transactions Fail'
);

export type AnalyticsActorMessage = ReturnType<
  | typeof getTransactions
  | typeof getTransactionsSuccess
  | typeof getTransactionsFail
>;

export interface Message {
  type: string;
}

export type Reducer<TState, TEvent> = (state: TState, event: TEvent) => TState;

export interface AnalyticsState {
  loading: boolean;
  loaded: boolean;
  data: any[];
  error: string;
}

export class AnalyticsService {
  getTransactions(filters: TransactionFilter) {
    return ajax<TransactionResponse>({
      url: '',
      method: 'POST',
      body: filters,
    });
  }
}
export class RxActor<TState, TMessage extends Message> {
  protected readonly receive$ = new Subject<TMessage>();

  protected readonly subscriptions = new Subscription();

  readonly onStateChange$ = this.receive$.pipe(
    startWith({ type: '__INIT__' }),
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

export const analyticsInitialState: AnalyticsState = {
  data: [],
  loading: false,
  loaded: false,
  error: '',
};

export const analyticsReducer = createReducer(
  analyticsInitialState,
  (builder) =>
    builder
      .addCase(getTransactions, (state) => ({
        ...state,
        data: [],
        loading: true,
        loaded: false,
        error: '',
      }))
      .addCase(getTransactionsSuccess, (state, { payload: { data } }) => ({
        ...state,
        data: [...data],
        loading: false,
        loaded: true,
        error: '',
      }))
      .addCase(getTransactionsFail, (state, { payload }) => ({
        ...state,
        loading: false,
        loaded: false,
        error: payload,
      }))
);

export class AnalyticsActor extends RxActor<
  AnalyticsState,
  AnalyticsActorMessage
> {
  private readonly analyticsService = new AnalyticsService();

  private readonly getSuccessfulTransactions$ = this.receive$.pipe(
    filter(({ type }) => type === getTransactions.type),
    switchMap(({ payload }: any) =>
      this.analyticsService.getTransactions(payload).pipe(
        map(({ response }) => getTransactionsSuccess(response)),
        catchError((err) => of(getTransactionsFail(err)))
      )
    )
  );

  constructor(
    reducer: Reducer<AnalyticsState, AnalyticsActorMessage>,
    initialState: AnalyticsState
  ) {
    super(reducer, initialState);
    this.subscriptions.add(this.getSuccessfulTransactions$.subscribe());
  }
}

export const analyticsActor = new AnalyticsActor(
  analyticsReducer,
  analyticsInitialState
);
