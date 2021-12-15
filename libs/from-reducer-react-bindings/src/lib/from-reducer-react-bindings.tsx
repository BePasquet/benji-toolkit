import { select } from 'from-reducer';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import { merge, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

export function snapshot<T>(obs$: Observable<T>): T {
  let value: T;

  obs$
    .pipe(
      take(1),
      tap((snap) => (value = snap))
    )
    .subscribe();

  return value;
}

export interface FromReducerStore<TState = any, TEvent = any> {
  state$: Observable<TState>;
  effects$: Observable<TEvent>;
  dispatch: (event: TEvent) => void;
}

export interface FromReducerProviderProps<TState, TEvent> {
  store: FromReducerStore<TState, TEvent>;
}

const FromReducerContext = createContext<Pick<
  FromReducerStore,
  'state$' | 'dispatch'
> | null>(null);

export function FromReducerProvider<TState, TEvent>({
  store,
  children,
}: PropsWithChildren<FromReducerProviderProps<TState, TEvent>>) {
  useLayoutEffect(() => {
    const subscription = merge(store.state$, store.effects$).subscribe();

    return () => subscription.unsubscribe();
  }, [store]);

  return (
    <FromReducerContext.Provider value={store}>
      {children}
    </FromReducerContext.Provider>
  );
}

export function useSelector<TState, TResult>(
  selector: (state: TState) => TResult
) {
  const { state$ } = useContext(FromReducerContext);
  const [state, setState] = useState(selector(snapshot(state$)));

  useLayoutEffect(() => {
    const subscription = state$
      .pipe(select(selector), tap(setState))
      .subscribe();

    return () => subscription.unsubscribe();
  }, [state$, selector]);

  return state;
}

export function useDispatch<TEvent>() {
  const { dispatch } = useContext(FromReducerContext);

  return useCallback((event: TEvent) => dispatch(event), [dispatch]);
}
