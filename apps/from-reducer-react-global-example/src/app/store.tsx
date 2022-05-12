import {
  repositoriesEpics,
  repositoriesInitialState,
  RepositoriesPartialState,
  repositoriesReducer,
  REPOSITORIES_STATE_KEY,
} from '@benji-toolkit/repositories';
import {
  userEpics,
  usersInitialState,
  UsersPartialState,
  usersReducer,
  USER_STATE_KEY,
} from '@benji-toolkit/users';
import { Action, combineReducers, fromReducer, Reducer } from 'from-reducer';
import { ignoreElements, Observable, tap, withLatestFrom } from 'rxjs';

export type GlobalState = UsersPartialState & RepositoriesPartialState;

const reducer = combineReducers({
  [USER_STATE_KEY]: usersReducer,
  [REPOSITORIES_STATE_KEY]: repositoriesReducer,
}) as Reducer<GlobalState, Action>;

const initialState: GlobalState = {
  [REPOSITORIES_STATE_KEY]: repositoriesInitialState,
  [USER_STATE_KEY]: usersInitialState,
};

const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__?.connect();
devTools.init(initialState);

const notifyDevTools = (
  actions$: Observable<Action>,
  state$: Observable<GlobalState>
) =>
  actions$.pipe(
    withLatestFrom(state$),
    tap(([event, state]) => devTools.send(event, state)),
    ignoreElements()
  );

const [state$, dispatch, combineEpics] = fromReducer(reducer, initialState);

const epics = [notifyDevTools, ...userEpics, ...repositoriesEpics];

const effects$ = combineEpics(...epics);

export const store = { state$, effects$, dispatch };
