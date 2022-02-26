import { defer, Observable, switchMap, throwError } from 'rxjs';

export function jsonSelector<TData = any>(
  response: Response
): Observable<TData> {
  const json$ = defer(() => response.json());

  const error$ = json$.pipe(
    switchMap((json) => throwError(() => json ?? { status: response.status }))
  );

  return response.ok ? json$ : error$;
}
