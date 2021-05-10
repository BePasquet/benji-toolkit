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
import React from 'react';

export type GlobalState = UsersPartialState & RepositoriesPartialState;

const reducer = combineReducers({
  [USER_STATE_KEY]: usersReducer,
  [REPOSITORIES_STATE_KEY]: repositoriesReducer,
}) as Reducer<GlobalState, Action>;

const initialState: GlobalState = {
  [REPOSITORIES_STATE_KEY]: repositoriesInitialState,
  [USER_STATE_KEY]: usersInitialState,
};

const [state$, dispatch, combineEpics] = fromReducer(reducer, initialState);

const epics = [...userEpics, ...repositoriesEpics];

const effects$ = combineEpics(...epics);

state$.subscribe();
effects$.subscribe();

export const gsCtx = { state$, dispatch, combineEpics };

export const GlobalStateContext = React.createContext(gsCtx);
