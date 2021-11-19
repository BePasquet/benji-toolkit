import { Action, createAction, createReducer } from 'from-reducer';
import { Observable, of, pipe } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  catchError,
  filter,
  ignoreElements,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { GitHubUser } from './github-user.interface';

export const USER_STATE_KEY = 'users';

export interface UsersState {
  data: GitHubUser[];
  loading: boolean;
  error: string;
}

export interface UsersPartialState {
  [USER_STATE_KEY]: UsersState;
}

// Actions
export const getUsers = createAction('[Users] Get Users');

export const getUsersSuccess = createAction<GitHubUser[]>(
  '[Users] Get Users Success'
);

export const getUsersFail = createAction<string>('[Users] Get Users Fail');

export type UserActions = ReturnType<
  typeof getUsers | typeof getUsersSuccess | typeof getUsersFail
>;

export const usersInitialState: UsersState = {
  loading: false,
  data: [],
  error: '',
};

// Reducer
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

// Epics
const getUsersEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter(({ type }) => type === getUsers.type),
    switchMap(() =>
      ajax<GitHubUser[]>(`https://api.github.com/users?per_page=5`).pipe(
        map(({ response }) => getUsersSuccess(response)),
        catchError((err) => of(getUsersFail(err)))
      )
    )
  );

const getUserFailEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter(({ type }) => type === getUsersFail.type),
    tap(({ payload }) => console.error(payload)),
    ignoreElements()
  );

export const userEpics = [getUsersEpic, getUserFailEpic];

export const selectUsersState = (state: UsersPartialState) =>
  state[USER_STATE_KEY];

// Selectors
export const selectUsers = pipe(selectUsersState, ({ data }) => data);

export const selectUsersLoading = pipe(
  selectUsersState,
  ({ loading }) => loading
);

export const selectUsersError = pipe(selectUsersState, ({ error }) => error);
