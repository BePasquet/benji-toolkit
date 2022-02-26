import { defer, Observable, switchMap, throwError } from 'rxjs';

export function jsonSelector<TData = any>(
  response: Response
): Observable<TData> {
  const json$ = defer(() => response.json());

  if (response.ok) {
    return json$ as Observable<TData>;
  }

  return json$.pipe(
    switchMap((json) => throwError(() => json ?? { status: response.status }))
  );
}
