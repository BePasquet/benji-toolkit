import { ReactiveActor } from '@benji-toolkit/reactive-actor';
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

  // @ts-ignore
  return data;
}

export interface ReactiveActorProviderProps<TState, TEvent> {
  actor: ReactiveActor<TState, TEvent>;
}

const contextInitialState = null as unknown;

const ReactiveActorContext = createContext<ReactiveActor<any, any>>(
  contextInitialState as ReactiveActor<any, any>
);

export function ReactiveActorProvider<TState, TEvent>({
  actor,
  children,
}: PropsWithChildren<ReactiveActorProviderProps<TState, TEvent>>) {
  const storeRef = useRef(actor).current;
  useEffect(() => {
    return () => storeRef.stop();
  }, [storeRef]);

  return (
    <ReactiveActorContext.Provider value={actor}>
      {children}
    </ReactiveActorContext.Provider>
  );
}

export function useSelector<TState, TResult>(
  selector: (state: TState) => TResult
) {
  const selectorRef = useRef(selector).current;
  const actor = useContext(ReactiveActorContext);
  const [state, setState] = useState(selectorRef(snapshot(actor.state$)));

  useLayoutEffect(() => {
    const subscription = actor.state$
      .pipe(select(selectorRef), tap(setState))
      .subscribe();

    return () => subscription.unsubscribe();
  }, [actor, selectorRef]);

  return state;
}

export function useDispatch<TEvent>() {
  const actor = useContext(ReactiveActorContext);

  return useCallback((event: TEvent) => actor.send(event), [actor]);
}
