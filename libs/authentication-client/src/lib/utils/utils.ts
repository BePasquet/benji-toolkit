import { Event, EventCreator } from '@benji-toolkit/reactive-actor';
import { Observable, catchError, filter, map, of, take } from 'rxjs';

/**
 * Reads an observable value synchronously (needs to be or be shared by a behavior subject or replay subject)
 * @param source$: observable
 * @returns the last value stored in the observable
 */
export function readLatestSync<T>(source$: Observable<T>): T | null {
  let value: T | null = null;

  source$.pipe(take(1)).subscribe((data) => {
    value = data;
  });

  return value;
}

/**
 * Compare two objects one level, doesn't test for inner objects arrays or function
 * will simply compare pointers
 * @param a: object to compare
 * @param b: object to compare
 * @returns whether they are equal or not
 */
export function objectComparator<T extends object>(a: T, b: T): boolean {
  const as = Object.keys(a);
  const bs = Object.keys(b);

  if (as.length !== bs.length) {
    return false;
  }

  return as.every((key) => a[key] === b[key]);
}

export function ofMultipleTypes<T extends Event>(...events: EventCreator[]) {
  return (source$: Observable<T>) =>
    source$.pipe(filter(({ type }) => events.some((ev) => ev.type === type)));
}

export function mapToData<D, T extends { data: D }>() {
  return (source$: Observable<T>) => source$.pipe(map(({ data }) => data));
}

export function catchErrorToEvent<T = unknown>(event: EventCreator) {
  return (source$: Observable<T>) =>
    source$.pipe(catchError((err) => of(event(err))));
}
