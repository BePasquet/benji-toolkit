import {
  Actor,
  createEvent,
  createReducer,
  eventReducer,
  ofType,
} from '@benji-toolkit/reactive-actor';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { GitHubUser } from './github-user.interface';

export interface UsersState {
  data: GitHubUser[];
  loading: boolean;
  error: string;
}

export const getUsers = createEvent('[Users] Get Users');

export const getUsersSuccess = createEvent<GitHubUser[]>(
  '[Users] Get Users Success'
);

export const getUsersFail = createEvent<string>('[Users] Get Users Fail');

export const usersInitialState: UsersState = {
  loading: false,
  data: [],
  error: '',
};

export const usersReducer = createReducer(usersInitialState, (builder) =>
  builder
    .addCase(getUsers, (state) => ({
      ...state,
      loading: true,
      data: [],
      error: '',
    }))
    .addCase(getUsersSuccess, (state, { payload }) => ({
      ...state,
      loading: false,
      data: [...payload],
      error: '',
    }))
    .addCase(getUsersFail, (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
    }))
);

export type UsersActorEvents = ReturnType<typeof getUsers>;

export class UsersActor extends Actor<UsersActorEvents> {
  readonly state$ = this.messages$.pipe(
    eventReducer(usersReducer, usersInitialState),
    takeUntil(this.stop$)
  );

  private readonly getUsers$ = this.messages$.pipe(
    ofType(getUsers),
    switchMap(() =>
      ajax<GitHubUser[]>(`https://api.github.com/users?per_page=5`).pipe(
        map(({ response }) => getUsersSuccess(response)),
        catchError((err) => of(getUsersFail(err)))
      )
    )
  );

  private readonly getUsersFail$ = this.messages$.pipe(
    ofType(getUsersFail),
    tap(({ payload }) => console.error(payload)),
    takeUntil(this.stop$)
  );

  constructor() {
    super('users');
    this.answer(this.getUsers$);
    this.state$.subscribe();
    this.getUsersFail$.subscribe();
  }
}
