import {
  Action,
  combineReducers,
  fromReducer,
  Reducer,
} from '@benji-toolkit/from-reducer';
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

export type GlobalState = UsersPartialState & RepositoriesPartialState;

const reducer = combineReducers({
  [USER_STATE_KEY]: usersReducer,
  [REPOSITORIES_STATE_KEY]: repositoriesReducer,
}) as Reducer<GlobalState, Action>;

const initialState: GlobalState = {
  [REPOSITORIES_STATE_KEY]: repositoriesInitialState,
  [USER_STATE_KEY]: usersInitialState,
};

export const [state$, dispatch, combineEpics] = fromReducer(
  reducer,
  initialState
);

const epics = [...userEpics, ...repositoriesEpics];

export const effects$ = combineEpics(...epics);

state$.subscribe();
effects$.subscribe();
