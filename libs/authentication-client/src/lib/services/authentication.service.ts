import { AxiosInstance } from 'axios';
import { Observable, defer } from 'rxjs';
import { AuthenticationResponse } from '../interfaces/authentication-response';
import { Credentials } from '../interfaces/credentials.interface';
import { User } from '../interfaces/user.interface';
import { mapToData, readLatestSync } from '../utils/utils';
import { Storage } from './storage.service';

export const AUTHENTICATION_STORAGE_KEY = 'AUTHENTICATION';

export class AuthenticationService {
  constructor(
    private readonly storage: Storage,
    private readonly httpClient: AxiosInstance
  ) {}

  addAuthInterceptor(token$: Observable<string>): VoidFunction {
    const id = this.httpClient.interceptors.request.use((req) => {
      const token = readLatestSync(token$);
      console.log(token);

      if (token) {
        req.headers.set('Authorization', `Bearer ${token}`);
      }

      return req;
    });

    return () => this.httpClient.interceptors.request.eject(id);
  }

  getToken(): Observable<string | null> {
    return this.storage.getItem<string>(AUTHENTICATION_STORAGE_KEY);
  }

  saveAuthToken(token: string): Observable<null> {
    return this.storage.setItem(AUTHENTICATION_STORAGE_KEY, token);
  }

  getUser(token = ''): Observable<User> {
    return defer(() =>
      this.httpClient.get<User>(`/user/me`, {
        headers: { Authorization: token },
      })
    ).pipe(mapToData());
  }

  login(credentials: Credentials): Observable<AuthenticationResponse> {
    return defer(() =>
      this.httpClient.post<AuthenticationResponse>(`/user/login`, credentials)
    ).pipe(mapToData());
  }

  logout(): Observable<null> {
    return this.storage.delete(AUTHENTICATION_STORAGE_KEY);
  }
}
