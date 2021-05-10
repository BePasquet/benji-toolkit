import { Action } from 'from-reducer';
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  catchError,
  filter,
  ignoreElements,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Repository } from './repository.interface';

export const REPOSITORIES_STATE_KEY = 'repositories';

export interface RepositoriesState {
  data: Repository[];
  loading: boolean;
  error: string;
}

export interface RepositoriesPartialState {
  [REPOSITORIES_STATE_KEY]: RepositoriesState;
}

// Actions
enum RepositoriesAction {
  GetRepositories = '[Repositories] Get Repositories',
  GetRepositoriesSuccess = '[Repositories] Get Repositories Success',
  GetRepositoriesFail = '[Repositories] Get Repositories Fail',
}

export const getRepositories = () => ({
  type: RepositoriesAction.GetRepositories,
  payload: null,
});

export const getRepositoriesSuccess = (payload: Repository[]) => ({
  type: RepositoriesAction.GetRepositoriesSuccess,
  payload,
});

export const getRepositoriesFail = (payload: string) => ({
  type: RepositoriesAction.GetRepositoriesFail,
  payload,
});

type RepositoriesActions = ReturnType<
  | typeof getRepositories
  | typeof getRepositoriesSuccess
  | typeof getRepositoriesFail
>;

export const repositoriesInitialState: RepositoriesState = {
  loading: false,
  data: [],
  error: '',
};

// Reducer
export function repositoriesReducer(
  state: RepositoriesState,
  action: RepositoriesActions
): RepositoriesState {
  switch (action.type) {
    case RepositoriesAction.GetRepositories: {
      return { ...state, loading: true, data: [], error: '' };
    }

    case RepositoriesAction.GetRepositoriesSuccess: {
      return {
        ...state,
        loading: false,
        data: [...action.payload],
        error: '',
      };
    }

    case RepositoriesAction.GetRepositoriesFail: {
      return { ...state, loading: false, error: action.payload };
    }
  }

  return state;
}

// Epics
const getRepositoriesEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter(({ type }) => type === RepositoriesAction.GetRepositories),
    switchMap(() =>
      ajax<Repository[]>(`https://api.github.com/orgs/nrwl/repos`).pipe(
        map(({ response }) => getRepositoriesSuccess(response)),
        catchError((err) => of(getRepositoriesFail(err)))
      )
    )
  );

const getRepositoriesFailEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter(({ type }) => type === RepositoriesAction.GetRepositoriesFail),
    tap(({ payload }) => console.error(payload)),
    ignoreElements()
  );

export const repositoriesEpics = [getRepositoriesEpic, getRepositoriesFailEpic];

// Selectors
export const selectRepositories = ({ data }: RepositoriesState) => data;

export const selectRepositoriesLoading = ({ loading }: RepositoriesState) =>
  loading;

export const selectRepositoriesError = ({ error }: RepositoriesState) => error;
