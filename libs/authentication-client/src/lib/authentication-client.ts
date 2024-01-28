import { AxiosInstance } from 'axios';
import { map } from 'rxjs';
import {
  AuthenticationActor,
  login,
  logout,
  verifyAuth,
} from './actors/authentication.actor';
import { Credentials } from './interfaces/credentials.interface';
import { AuthenticationService } from './services/authentication.service';
import { Storage } from './services/storage.service';

export class AuthenticationClient {
  private readonly authenticationService = new AuthenticationService(
    this.storageService,
    this.httpClient
  );

  private readonly authentication = new AuthenticationActor(
    this.authenticationService
  );

  readonly state$ = this.authentication.state$;

  private interceptorsSubscriptions: VoidFunction[] = [];

  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly storageService: Storage
  ) {}

  verifyAuth(): void {
    this.authentication.send(verifyAuth(null));
  }

  login(credentials: Credentials): void {
    this.authentication.send(login(credentials));
  }

  logout(): void {
    this.authentication.send(logout(null));
  }

  addAuthInterceptor(): void {
    const token$ = this.state$.pipe(map(({ token }) => token));

    const interceptor = this.authenticationService.addAuthInterceptor(token$);
    this.interceptorsSubscriptions.push(interceptor);
  }

  removeAuthInterceptor(): void {
    if (this.interceptorsSubscriptions.length) {
      this.interceptorsSubscriptions.forEach((removeInterceptor) =>
        removeInterceptor()
      );
    }
  }
}
