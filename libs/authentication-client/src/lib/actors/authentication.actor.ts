import {
  Actor,
  createEvent,
  createReducer,
  eventReducer,
  ofType,
} from '@benji-toolkit/reactive-actor';
import {
  distinctUntilChanged,
  exhaustMap,
  map,
  switchMap,
  takeUntil,
  throwError,
} from 'rxjs';
import { AuthenticationResponse } from '../interfaces/authentication-response';
import { Credentials } from '../interfaces/credentials.interface';
import { User } from '../interfaces/user.interface';
import { AuthenticationService } from '../services/authentication.service';
import { catchErrorToEvent, objectComparator } from '../utils/utils';

export const TOKEN_NOT_FOUND_ERROR = 'TOKEN_NOT_FOUND';

export const AUTHENTICATION_ACTOR_REF = 'AUTHENTICATION';

export const verifyAuth = createEvent(
  `[${AUTHENTICATION_ACTOR_REF}] Verify Auth`
);

export const verifyAuthSuccess = createEvent<AuthenticationResponse>(
  `[${AUTHENTICATION_ACTOR_REF}] Verify Auth Success`
);

export const verifyAuthFail = createEvent<string>(
  `[${AUTHENTICATION_ACTOR_REF}] Verify Auth Fail`
);

export const login = createEvent<Credentials>(
  `[${AUTHENTICATION_ACTOR_REF}] Login`
);

export const loginSuccess = createEvent<AuthenticationResponse>(
  `[${AUTHENTICATION_ACTOR_REF}] Login Success`
);

export const loginFail = createEvent<string>(
  `[${AUTHENTICATION_ACTOR_REF}] Login Fail`
);

export const logout = createEvent(`${AUTHENTICATION_ACTOR_REF} Logout`);

export const logoutSuccess = createEvent(
  `${AUTHENTICATION_ACTOR_REF} Logout Success`
);

export const logoutFail = createEvent<string>(
  `${AUTHENTICATION_ACTOR_REF} Logout Fail`
);

export const getUser = createEvent(`[${AUTHENTICATION_ACTOR_REF}] Get User`);

export const getUserSuccess = createEvent<User>(
  `[${AUTHENTICATION_ACTOR_REF}] Get User Success`
);

export const getUserFail = createEvent<string>(
  `[${AUTHENTICATION_ACTOR_REF}] Get User Fail`
);

export const saveAuthToken = createEvent<string>(
  `[${AUTHENTICATION_ACTOR_REF}] Save Token`
);

export const saveAuthTokenSuccess = createEvent(
  `[${AUTHENTICATION_ACTOR_REF}] Save Token Success`
);

export const saveAuthTokenFail = createEvent<string>(
  `[${AUTHENTICATION_ACTOR_REF}] Save Token Fail`
);

export const removeAuthInterceptor = createEvent(
  `[${AUTHENTICATION_ACTOR_REF}] Remove Auth Interceptor`
);

export interface AuthenticationState {
  verified: boolean;
  user: User | null;
  token: string;
  loading: boolean;
  error: string;
}

export const authenticationInitialState: AuthenticationState = {
  verified: false,
  user: null,
  token: '',
  loading: false,
  error: '',
};

export const authenticationReducer = createReducer(
  authenticationInitialState,
  (builder) =>
    builder
      .addCase(verifyAuth, (state) => ({ ...state, loading: true }))
      .addCase(verifyAuthSuccess, (state, { payload: { user, token } }) => ({
        ...state,
        verified: true,
        user,
        token,
        loading: false,
      }))
      .addCase(verifyAuthFail, (state, { payload }) => ({
        ...state,
        verified: true,
        error: payload,
        loading: false,
      }))
      .addCase(getUser, (state) => ({ ...state, loading: true }))
      .addCase(getUserSuccess, (state, { payload }) => ({
        ...state,
        user: payload,
        loading: false,
      }))
      .addCase(getUserFail, (state, { payload }) => ({
        ...state,
        error: payload,
        loading: false,
      }))
      .addCase(login, (state) => ({ ...state, loading: true }))
      .addCase(loginSuccess, (state, { payload: { user, token } }) => ({
        ...state,
        user,
        token,
        loading: false,
      }))
      .addCase(loginFail, (state, { payload }) => ({
        ...state,
        error: payload,
        loading: false,
      }))
      .addCase(logout, (state) => ({ ...state, loading: true }))
      .addCase(logoutSuccess, (state) => ({
        ...state,
        token: '',
        loading: false,
      }))
      .addCase(logoutFail, (state, { payload }) => ({
        ...state,
        error: payload,
        loading: true,
      }))
);

export class AuthenticationActor extends Actor {
  readonly state$ = this.messages$.pipe(
    eventReducer(authenticationReducer, authenticationInitialState),
    distinctUntilChanged(objectComparator),
    takeUntil(this.stop$)
  );

  private readonly verifyAuth$ = this.messages$.pipe(
    ofType(verifyAuth),
    exhaustMap(() =>
      this.authenticationService.getToken().pipe(
        exhaustMap((token) =>
          token
            ? this.authenticationService
                .getUser()
                .pipe(map((user) => verifyAuthSuccess({ user, token })))
            : throwError(() => TOKEN_NOT_FOUND_ERROR)
        ),
        catchErrorToEvent(verifyAuthFail)
      )
    )
  );

  private readonly getUser$ = this.messages$.pipe(
    ofType(getUser),
    switchMap(() =>
      this.authenticationService.getUser().pipe(
        map((user) => getUserSuccess(user)),
        catchErrorToEvent(getUserFail)
      )
    )
  );

  private readonly login$ = this.messages$.pipe(
    ofType(login),
    exhaustMap(({ payload }) =>
      this.authenticationService.login(payload).pipe(
        map((response) => loginSuccess(response)),
        catchErrorToEvent(loginFail)
      )
    )
  );

  private readonly loginSuccess$ = this.messages$.pipe(
    ofType(loginSuccess),
    map(({ payload: { token } }) => saveAuthToken(token))
  );

  private readonly saveAuthToken$ = this.messages$.pipe(
    ofType(saveAuthToken),
    switchMap(({ payload }) =>
      this.authenticationService.saveAuthToken(payload).pipe(
        map(() => saveAuthTokenSuccess(null)),
        catchErrorToEvent(saveAuthTokenFail)
      )
    )
  );

  private readonly logout$ = this.messages$.pipe(
    ofType(logout),
    exhaustMap(() =>
      this.authenticationService.logout().pipe(
        map(() => logoutSuccess(null)),
        catchErrorToEvent(logoutFail)
      )
    )
  );

  constructor(private readonly authenticationService: AuthenticationService) {
    super(AUTHENTICATION_ACTOR_REF);

    this.answer(
      this.verifyAuth$,
      this.getUser$,
      this.saveAuthToken$,
      this.login$,
      this.loginSuccess$,
      this.logout$
    );

    this.state$.subscribe();
  }
}
