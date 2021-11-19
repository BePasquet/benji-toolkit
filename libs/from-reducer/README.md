# fromReducer

[![npm version](https://badge.fury.io/js/from-reducer.svg)](https://badge.fury.io/js/from-reducer)

Helper function built around rxjs scan operator and subjects, its purpose was to have a zero configuration helper to manage either local or global state in different environments with rxjs.

Given a reducer function and an initial state creates a tuple which values will be:

1.  An observable with the form of `Observable<S>` (where S denotes the shape of the state)
    that will emit a value every time is notified of an event, with the result of applying the reducer to the current state and the incoming event.
    <br />

2.  A function with the form of `(event: T) => void` to notify the previous observable that an event has occur.
    <br />

3.  A function that accepts arguments with the form of `(events$: Observable<T>, state$?: Observable<S>) => Observable<T>` that once applied will produce an observable resulting from merging the application of each function to the event and state streams,, this may be helpful at the moment of intercepting actions.

## IMPORTANT: USES RXJS VERSION 7.2

## Installation

```
npm i from-reducer
```

## NOTE: THIS LIBRARY DOESN'T REPLACE REDUX OR NGRX.

This package can be helpful on small projects or places where you are just able to use rxjs, redux and ngrx has been highly proven against the environment and are an amazing solution that i personally use in my projects.
So why?
You can think it as a rxjs version of react useReducer with middleware

### TLDR

### Single reducer

```ts
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

// Model
export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface UsersState {
  data: GitHubUser[];
  loading: boolean;
  error: string;
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

const subscription = new Subscription();

const [state$, dispatch, combineEpics] = fromReducer(
  usersReducer,
  usersInitialState
);

// observable of side effects
const effects$ = combineEpics(...userEpics);

subscription.add(state$.subscribe(console.log));
// { loading: true, data: [], error: '' }
// { loading: true, data: [...], error: '' } || { loading: false, data: [], error: '...' }
subscription.add(effects$.subscribe());

dispatch(getUsers());
```

### Multiple reducers

```ts
import {
  Action,
  combineReducers,
  createAction,
  createReducer,
  fromReducer,
} from 'from-reducer';
import {
  catchError,
  filter,
  ignoreElements,
  map,
  Observable,
  of,
  pipe,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';

// Model
export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

const USERS_STATE_KEY = 'users';

export interface UsersState {
  data: GitHubUser[];
  loading: boolean;
  error: string;
}

export interface UsersPartialState {
  [USERS_STATE_KEY]: UsersState;
}

// Actions
export const getUsers = createAction('[Users] Get Users');

export const getUsersSuccess = createAction<GitHubUser[]>(
  '[Users] Get Users Success'
);

export const getUsersFail = createAction<string>('[Users] Get Users Fail');

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

// Selectors
export const selectUsersState = (state: UsersPartialState) =>
  state[USERS_STATE_KEY];

export const selectUsers = pipe(selectUsersState, ({ data }) => data);

// Products

// Model
export interface Product {
  id: string;
  name: string;
}

const PRODUCTS_STATE_KEY = 'products';

interface ProductsState {
  data: Product[];
  loading: boolean;
  error: string;
}

export interface ProductsPartialState {
  [PRODUCTS_STATE_KEY]: ProductsState;
}

const getProducts = createAction('[Products] Get Products');

const getProductsSuccess = createAction<Product[]>(
  '[Products] Get Products Success'
);

const getProductsFail = createAction<string>('[Products] Get Products Fail');

const productsInitialState: ProductsState = {
  data: [],
  loading: false,
  error: '',
};

const productReducer = createReducer(productsInitialState, (builder) =>
  builder
    .addCase(getProducts, (state) => ({
      ...state,
      data: [],
      loading: true,
      error: '',
    }))
    .addCase(getProductsSuccess, (state, { payload }) => ({
      ...state,
      data: [...payload],
      loading: false,
      error: '',
    }))
    .addCase(getProductsFail, (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
    }))
);

const getProductsEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter(({ type }) => type === getProducts.type),
    switchMap(() =>
      ajax<Product[]>(`https://api.github.com/products`).pipe(
        map(({ response }) => getProductsSuccess(response)),
        catchError((err) => of(getProductsFail(err)))
      )
    )
  );

const getProductsFailEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter(({ type }) => type === getProductsFail.type),
    tap(({ payload }) => console.error(payload)),
    ignoreElements()
  );

const productsEpics = [getProductsEpic, getProductsFailEpic];

// Selectors
export const selectProductsState = (state: ProductsPartialState) =>
  state[PRODUCTS_STATE_KEY];

export const selectProducts = pipe(selectProductsState, ({ data }) => data);

// Action logger
const actionLoggerEpic = (actions$: Observable<Action>) =>
  actions$.pipe(tap(console.log), ignoreElements());

const reducers = {
  [USERS_STATE_KEY]: usersReducer,
  [PRODUCTS_STATE_KEY]: productReducer,
};

export type AppState = UsersPartialState & ProductsPartialState;

const initialState: AppState = {
  [USERS_STATE_KEY]: usersInitialState,
  [PRODUCTS_STATE_KEY]: productsInitialState,
};

const reducer = combineReducers(reducers);
const [state$, dispatch, combineEpics] = fromReducer(reducer, initialState);

const epics = [...userEpics, ...productsEpics, actionLoggerEpic];
const effects$ = combineEpics(...epics);

const subscription = new Subscription();

subscription.add(state$.subscribe());
subscription.add(effects$.subscribe());

dispatch(getUsers());
dispatch(getProducts());
```

## Examples

### React and Angular in same monorepo with shared library with state

https://github.com/BePasquet/benji-toolkit/tree/master/apps

### React Local State Management

https://github.com/BePasquet/benji-toolkit/blob/master/apps/from-reducer-react-local-example/src/app/users/users.component.tsx

### React Global State Management

https://github.com/BePasquet/benji-toolkit/blob/master/apps/from-reducer-react-global-example/src/app/store.tsx

https://github.com/BePasquet/benji-toolkit/blob/master/apps/from-reducer-react-global-example/src/app/users/users.component.tsx

### Angular Local State Management

https://github.com/BePasquet/benji-toolkit/blob/master/apps/from-reducer-angular-local-example/src/app/users/users.component.ts

### Angular Global State Management

https://github.com/BePasquet/benji-toolkit/blob/master/apps/from-reducer-angular-global-example/src/app/store.ts

https://github.com/BePasquet/benji-toolkit/blob/master/apps/from-reducer-angular-global-example/src/app/users/users.component.ts

### Angular Local State Management No Change Detection Zone js

https://github.com/BePasquet/benji-toolkit/blob/master/apps/from-reducer-angular-no-change-detection-zone/src/app/users/users.component.ts

#### With NgRx Store

```
npm install @ngrx/store --save
```

##### https://ngrx.io/guide/store/actions

##### https://ngrx.io/guide/store/reducers

```ts
import { Action, createAction, createReducer, on, props } from '@ngrx/store';
import { ofType } from '@ngrx/effects'
import { Observable, of, Subscription } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { filter, switchMap, map, catchError, tap, ignoreElements } from 'rxjs';

// Model we want to work with
export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

// Actions
const getUsers = createAction('[Users] Get Users');
const getUserSuccess = createAction(
  '[Users] Get Users Success',
  props<{ payload: GitHubUser[] }>()
);
const getUsersFail = createAction(
  '[Users] Get Users Fail',
  props<{ payload: string }>()
);

// Reducer slice state definition
interface UsersState {
  loading: boolean;
  data: User[];
  error: string;
}

// Reducer initial state
const usersInitialState: UsersState = {
  loading: false,
  data: [],
  error: '',
};

// Reducer
const usersReducer = createReducer(
  usersInitialState,
  on(getUsers, (state) => ({
    ...state,
    loading: true,
    data: [],
    error: '',
  })),
  on(getUserSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    data: [...payload],
    error: '',
  })),
  on(getUsersFail, (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
  }))
);

// Side Effects
const getUsersEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    ofType(getUsers),
    switchMap(() =>
      ajax<GitHubUser[]>(`https://api.github.com/users?per_page=5`).pipe(
        map(({ response }) => getUserSuccess({ payload: response })),
        catchError((err) => of(getUsersFail({ payload: err })))
      )
    )
  );

const getUserFailEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    ofType(getUsersFail)
    tap(({ payload }) => console.error(payload)),
    ignoreElements()
  );

const userEpics = [getUsersEpic, getUserFailEpic];

const subscription = new Subscription();
const [state$, dispatch, combineEpics] = fromReducer(
  usersReducer,
  usersInitialState
);

const effects$ = combineEpics(...userEpics);

subscription.add(state$.subscribe(console.log));
// { loading: true, data: [], error: '' }
// { loading: true, data: [...], error: '' } || { loading: false, data: [], error: '...' }
subscription.add(effects$.subscribe());

dispatch(getUsers());
```

### Change of state imperatively:

more info on this pattern: https://reactjs.org/docs/hooks-state.html

```ts
interface UsersComponentState {
  loading: boolean;
  users: User[];
  error: string;
}

function usersComponentReducer(
  state: UsersComponentState,
  slice: Partial<UsersComponentState>
): UsersComponentState {
  return { ...state, ...slice };
}

const componentInitialState: UsersComponentState = {
  loading: false,
  users: [],
  error: '',
};

const subscription = new Subscription();

const [state$, setState] = fromReducer(
  usersComponentReducer,
  componentInitialState
);

subscription.add(state$.subscribe(console.log));
// { loading: true, data: [], error: '' }
// { loading: true, data: [...], error: '' } || { loading: false, data: [], error: '...' }

setState({ loading: true });

const requestUsers$ = ajax<User[]>(
  `https://api.github.com/users?per_page=5`
).pipe(
  map(({ response }) => ({ loading: false, users: response, error: '' })),
  catchError((err) => of({ loading: false, error: err })),
  tap(setState)
);

subscription.add(requestUsers$.subscribe());
```

```ts
// Later unsubscribe to state changes and effects
subscription.unsubscribe();
```
