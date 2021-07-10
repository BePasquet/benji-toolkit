import { Action } from 'from-reducer';
import {
  catchError,
  filter,
  ignoreElements,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
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
enum UserActionType {
  GetUser = '[Users] Get Users',
  GetUserSuccess = '[Users] Get Users Success',
  GetUserFail = '[Users] Get Users Fail',
}

export const getUsers = () => ({
  type: UserActionType.GetUser,
  payload: null,
});

export const getUsersSuccess = (payload: GitHubUser[]) => ({
  type: UserActionType.GetUserSuccess,
  payload,
});

export const getUsersFail = (payload: string) => ({
  type: UserActionType.GetUserFail,
  payload,
});

type UserActions = ReturnType<
  typeof getUsers | typeof getUsersSuccess | typeof getUsersFail
>;

export const usersInitialState: UsersState = {
  loading: false,
  data: [],
  error: '',
};

// Reducer
export function usersReducer(
  state: UsersState,
  action: UserActions
): UsersState {
  switch (action.type) {
    case UserActionType.GetUser: {
      return { ...state, loading: true, data: [], error: '' };
    }

    case UserActionType.GetUserSuccess: {
      return {
        ...state,
        loading: false,
        data: [...action.payload],
        error: '',
      };
    }

    case UserActionType.GetUserFail: {
      return { ...state, loading: false, error: action.payload };
    }
  }

  return state;
}

// Epics
const getUsersEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter(({ type }) => type === UserActionType.GetUser),
    switchMap(() =>
      ajax<GitHubUser[]>(`https://api.github.com/users?per_page=5`).pipe(
        map(({ response }) => getUsersSuccess(response)),
        catchError((err) => of(getUsersFail(err)))
      )
    )
  );

const getUserFailEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter(({ type }) => type === UserActionType.GetUserFail),
    tap(({ payload }) => console.error(payload)),
    ignoreElements()
  );

export const userEpics = [getUsersEpic, getUserFailEpic];

// Selectors
export const selectUsers = ({ data }: UsersState) => data;

export const selectUsersLoading = ({ loading }: UsersState) => loading;

export const selectUsersError = ({ error }: UsersState) => error;
