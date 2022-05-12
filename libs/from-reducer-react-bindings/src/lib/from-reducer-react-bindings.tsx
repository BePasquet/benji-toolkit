import { select } from 'from-reducer';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { merge, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

export function snapshot<T>(obs$: Observable<T>): T {
  let data: T;

  obs$.pipe(take(1)).subscribe((snap) => {
    data = snap;
  });

  return data;
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
  const selectorRef = useRef(selector).current;
  const { state$ } = useContext(FromReducerContext);
  const [state, setState] = useState(selectorRef(snapshot(state$)));

  useLayoutEffect(() => {
    const subscription = state$
      .pipe(select(selectorRef), tap(setState))
      .subscribe();

    return () => subscription.unsubscribe();
  }, [state$, selectorRef]);

  return state;
}

export function useDispatch<TEvent>() {
  const { dispatch } = useContext(FromReducerContext);

  return useCallback((event: TEvent) => dispatch(event), [dispatch]);
}
