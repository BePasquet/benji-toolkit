import { Observable, of } from 'rxjs';

export interface GetItemOptions {
  json?: boolean;
}

export class Storage {
  getItem<T>(
    key: string,
    options: GetItemOptions = { json: true }
  ): Observable<T | null> {
    const data = localStorage.getItem(key);
    const result: T | null = options.json && data ? JSON.parse(data) : data;
    return of(result);
  }

  setItem<T>(key: string, value: T): Observable<null> {
    localStorage.setItem(key, JSON.stringify(value));
    return of(null);
  }

  delete(key: string): Observable<null> {
    localStorage.removeItem(key);
    return of(null);
  }
}
