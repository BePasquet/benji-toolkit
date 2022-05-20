import { ReactiveStore } from '@benji-toolkit/reactive-store';
import { select } from 'from-reducer';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

export function snapshot<T>(obs$: Observable<T>): T {
  let data: T;

  obs$.pipe(take(1)).subscribe((snap) => {
    data = snap;
  });

  return data;
}

export interface FromReducerProviderProps<TState, TEvent> {
  store: ReactiveStore<TState, TEvent>;
}

const FromReducerContext = createContext<ReactiveStore<any, any> | null>(null);

export function FromReducerProvider<TState, TEvent>({
  store,
  children,
}: PropsWithChildren<FromReducerProviderProps<TState, TEvent>>) {
  const storeRef = useRef(store).current;
  useEffect(() => {
    return () => storeRef.stop();
  }, [storeRef]);

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
  const store = useContext(FromReducerContext);
  const [state, setState] = useState(selectorRef(snapshot(store.state$)));

  useLayoutEffect(() => {
    const subscription = store.state$
      .pipe(select(selectorRef), tap(setState))
      .subscribe();

    return () => subscription.unsubscribe();
  }, [store, selectorRef]);

  return state;
}

export function useDispatch<TEvent>() {
  const store = useContext(FromReducerContext);

  return useCallback((event: TEvent) => store.send(event), [store]);
}
