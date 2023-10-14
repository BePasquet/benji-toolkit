import { map } from 'rxjs';
import {
  AuthenticationActor,
  login,
  logout,
  verifyAuth,
} from './actors/authentication.actor';
import { AuthenticationService } from './services/authentication.service';

export class AuthenticationClient {
  readonly state$ = this.authentication.state$;

  private interceptorsSubscriptions: VoidFunction[] = [];

  constructor(
    private readonly authentication: AuthenticationActor,
    private readonly authenticationService: AuthenticationService
  ) {}

  verifyAuth(): void {
    this.authentication.send(verifyAuth(null));
  }

  login(): void {
    this.authentication.send(login(null));
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
