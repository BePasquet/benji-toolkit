import {
  BehaviorSubject,
  catchError,
  combineLatest,
  concat,
  EMPTY,
  interval,
  map,
  merge,
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

export interface RxHttpCacheOptions {
  cache: boolean;
  cacheTime: number;
}

export type RxHttpOptions = RxHttpCacheOptions;

export class RxHttp<TCache extends Record<string, unknown>> {
  private readonly upsertCache$ = new Subject<Partial<TCache>>();

  private readonly cache$: Observable<TCache>;

  private readonly subscriptions = new Subscription();

  private readonly interceptors = new Set<Observable<RequestInit>>();

  constructor(
    { cache, cacheTime }: RxHttpOptions,
    private readonly initialCache: TCache,
    private readonly errorHandler?: RxHttpErrorHandler
  ) {
    if (cache) {
      const cleanCache$ = cacheTime
        ? interval(cacheTime).pipe(map(() => this.initialCache))
        : EMPTY;

      this.cache$ = merge(this.upsertCache$, cleanCache$).pipe(
        scan((state, slice) => ({ ...state, ...slice }), this.initialCache),
        share({ connector: () => new BehaviorSubject(this.initialCache) })
      );

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
    return concat(...Array.from(this.interceptors)).pipe(
      scan((state, init) => ({ ...state, ...init }), requestInit)
    );
  }

  private request<T>(url: string, init: RequestInit): Observable<T> {
    return fromFetch<T>(url, { ...init, selector: jsonSelector }).pipe(
      tap((data) => this.upsertCache$.next({ [url]: data } as Partial<TCache>)),
      catchError((err, caught$) =>
        this.errorHandler
          ? this.errorHandler(err, caught$, this.cache$)
          : throwError(() => err)
      )
    );
  }

  private processRequest<T>(url: string, init: RequestInit): Observable<T> {
    const init$ = this.generateInit(init);

    const cacheValue$ = this.cache$.pipe(
      take(1),
      map((cache) => (cache[url] ?? null) as T | null)
    );

    return combineLatest([cacheValue$, init$]).pipe(
      switchMap(([cache, init]) =>
        cache ? of(cache) : this.request<T>(url, init)
      )
    );
  }
}
