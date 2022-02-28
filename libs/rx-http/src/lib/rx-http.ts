import {
  BehaviorSubject,
  catchError,
  combineLatest,
  concat,
  concatMap,
  delay,
  groupBy,
  map,
  merge,
  mergeMap,
  Observable,
  of,
  scan,
  share,
  Subject,
  Subscription,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { jsonSelector } from './json-selector';

export type RxHttpErrorHandler<TError = any, TSource = any, TCache = any> = (
  err: TError,
  caught$: Observable<TSource>,
  cache$: Observable<TCache>
) => Observable<TSource>;

export class RxHttp<TCache extends Record<string, unknown>> {
  private readonly upsertCache$ = new Subject<Partial<TCache>>();

  private readonly subscriptions = new Subscription();

  private readonly interceptors = new Set<Observable<RequestInit>>();

  private readonly delayDeleteCache$ = this.upsertCache$.pipe(
    concatMap((slice) => Object.keys(slice)),
    groupBy((key) => key),
    mergeMap((key$) =>
      key$.pipe(
        delay(this.cacheTime),
        map((key) => ({ [key]: null }))
      )
    )
  );

  private readonly cache$ = merge(
    this.delayDeleteCache$,
    this.upsertCache$
  ).pipe(
    scan((state, slice) => ({ ...state, ...slice }), {}),
    share({ connector: () => new BehaviorSubject({} as TCache) })
  );

  constructor(
    cache: boolean,
    private readonly cacheTime: number = 0,
    private readonly errorHandler: RxHttpErrorHandler = (err) =>
      throwError(() => err)
  ) {
    if (cache) {
      this.subscriptions.add(this.cache$.subscribe());
    }
  }

  get<T>(url: string, init: RequestInit = {}): Observable<T> {
    return this.processRequest<T>(url, { ...init, method: 'GET' });
  }

  post<T>(url: string, init: RequestInit = {}): Observable<T> {
    return this.processRequest<T>(url, { ...init, method: 'POST' });
  }

  patch<T>(url: string, init: RequestInit = {}): Observable<T> {
    return this.processRequest<T>(url, { ...init, method: 'PATCH' });
  }

  put<T>(url: string, init: RequestInit = {}): Observable<T> {
    return this.processRequest<T>(url, { ...init, method: 'PUT' });
  }

  delete<T>(url: string, init: RequestInit = {}): Observable<T> {
    return this.processRequest<T>(url, { ...init, method: 'DELETE' });
  }

  addInterceptor(init$: Observable<RequestInit>): VoidFunction {
    this.interceptors.add(init$);

    return () => {
      this.interceptors.delete(init$);
    };
  }

  clearInterceptors(): void {
    this.interceptors.clear();
  }

  unsubscribe(): void {
    this.subscriptions.unsubscribe();
  }

  private generateInit(requestInit: RequestInit): Observable<RequestInit> {
    /* 
       Apply interceptors in order they were added and request specific init after
       to be able to overwrite
    */
    const init$ = concat(...Array.from(this.interceptors)).pipe(
      scan((state, init) => ({ ...state, ...init }), requestInit)
    );

    return init$;
  }

  private request<T>(url: string, init: RequestInit): Observable<T> {
    const request$ = fromFetch<T>(url, {
      ...init,
      selector: jsonSelector,
    }).pipe(
      tap((data) => this.upsertCache$.next({ [url]: data } as Partial<TCache>)),
      catchError((err, caught$) => this.errorHandler(err, caught$, this.cache$))
    );

    return request$;
  }

  private processRequest<T>(url: string, init: RequestInit): Observable<T> {
    const init$ = this.generateInit(init);

    const cacheValue$ = this.cache$.pipe(
      take(1),
      map((cache) => (cache[url] ?? null) as T | null)
    );

    const response$ = combineLatest([cacheValue$, init$]).pipe(
      switchMap(([cache, init]) =>
        cache ? of(cache) : this.request<T>(url, init)
      )
    );

    return response$;
  }
}
