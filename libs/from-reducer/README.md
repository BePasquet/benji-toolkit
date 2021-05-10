# fromReducer

Helper function built around rxjs scan operator and subjects, its purpose was to have a zero configuration helper to manage either local or global state in different environments with rxjs.

Given a reducer function and an initial state creates a tuple which values will be:

1.  A observable with the form of `Observable<S>` that will emit a value every time is notified that a
    new event happened with the result of the reduction between the current state and the value of an event,
    this result will become the current state.

2.  A function with the form of `(event: T) => void` to notify the previous observable that an event has occur.

3.  A function that given an array of functions with the form of `(events$: Observable<T>, state$?: Observable<S>) => Observable<T>`
    will merge the result of applying them to the event stream and the observable of state.
    This will come helpful when we want to intercept events to perform a side effect.

## IMPORTANT: USES RXJS VERSION 7

## NOTE: THIS LIBRARY DOESN'T REPLACE REDUX OR NGRX.

Where this package can be helpful on small projects or places where you are just able to use rxjs, redux and ngrx has been highly proven against the environment and are an amazing solution that i personally use in my projects.
So why?
You can think it as a rxjs version of react useReducer with middleware

### TLDR

##### Single reducer

```ts
import { fromReducer, Action } from 'from-reducer';
import { interval, Observable, Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

// Actions
enum CounterActions {
  Increment = 'INCREMENT',
  IncrementEvery = 'INCREMENT_EVERY',
}

const increment = () => ({ type: CounterActions.Increment });
const incrementEvery = (time: number) => ({
  type: CounterActions.IncrementEvery,
  payload: time,
});

// Reducer
const counterInitialState = {
  counter: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case CounterActions.Increment: {
      return { ...state, counter: state.counter + 1 };
    }
  }
};

// Epic
const incrementEverySecondEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter(({ type }) => type === CounterActions.IncrementEvery),
    switchMap(({ payload }) => interval(payload).pipe(map(() => increment())))
  );

const [state$, dispatch, combineEpics] = fromReducer(
  reducer,
  counterInitialState
);

const effects$ = combineEpics(incrementEverySecondEpic);

const subscription = new Subscription();

subscription.add(state$.subscribe(console.log));
// { counter: 0 }
// { counter: 1 }
// ...
subscription.add(effects$.subscribe());

dispatch(increment());
dispatch(incrementEvery(1000));
```

##### Multiple reducers

```ts
import { Action, fromReducer } from 'from-reducer';
import { Observable } from 'rxjs';
import { ignoreElements, tap } from 'rxjs/operators';
import { combineReducers } from './util';

// User
interface UserState {
  data: { name: string } | null;
}

enum UserAction {
  GetUser = 'GET_USER',
}

const getUser = () => ({ type: UserAction.GetUser });
const userStateKey = 'user';
const userInitialState: UserState = { data: null };

const userReducer = (state: UserState, action: ReturnType<typeof getUser>) => {
  switch (action.type) {
    case UserAction.GetUser: {
      return { ...state, data: { name: 'Benji' } };
    }
  }
};

// Products
interface ProductsState {
  data: { id: string; name: string }[];
}

enum ProductAction {
  GetProducts = 'GET_PRODUCTS',
}

const getProducts = () => ({ type: ProductAction.GetProducts });
const productStateKey = 'products';
const productInitialState: ProductsState = { data: [] };

const productReducer = (
  state: ProductsState,
  action: ReturnType<typeof getProducts>
) => {
  switch (action.type) {
    case ProductAction.GetProducts: {
      return { ...state, data: [{ id: '1', name: 'Pre workout' }] };
    }
  }
};

// Action logger
const actionLoggerEpic = (actions$: Observable<Action>) =>
  actions$.pipe(tap(console.log), ignoreElements());

const reducers = {
  [userStateKey]: userReducer,
  [productStateKey]: productReducer,
};

const initialState = {
  [userStateKey]: userInitialState,
  [productStateKey]: productInitialState,
};

const reducer = combineReducers(reducers);
const [state$, dispatch, combineEpics] = fromReducer(reducer, initialState);
const effects$ = combineEpics(actionLoggerEpic);

const subscription = new Subscription();

subscription.add(state$.subscribe());
subscription.add(effects$.subscribe());

dispatch(getUser());
dispatch(getProducts());
```

## Examples

```
npm i from-reducer
```

```
npm install rxjs
```

### Redux pattern:

more info on this pattern: https://redux.js.org

### Middleware based on redux observable

more info: https://redux-observable.js.org/

#### With a switch reducer

```ts
import { Observable, of, Subscription } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  filter,
  switchMap,
  map,
  catchError,
  tap,
  ignoreElements,
} from 'rxjs/operators';

// Model we want to work with
interface User {
  id: string;
  name: string;
}

// Actions
enum UserActionType {
  GetUser = '[Users] Get Users',
  GetUserSuccess = '[Users] Get Users Success',
  GetUserFail = '[Users] Get Users Fail',
}

class GetUsers {
  readonly type = UserActionType.GetUser;
}

class GetUsersSuccess {
  readonly type = UserActionType.GetUserSuccess;
  constructor(readonly payload: User[]) {}
}

class GetUsersFail {
  readonly type = UserActionType.GetUserFail;
  constructor(readonly payload: string) {}
}

type UserActions = GetUsers | GetUsersSuccess | GetUsersFail;

// Reducer slice state
interface UsersState {
  loading: boolean;
  data: User[];
  error: string;
}

const usersInitialState: UsersState = {
  loading: false,
  data: [],
  error: '',
};

// Reducer
function usersReducer(
  state: UsersState,
  action: UserActions | Action
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

// Side Effects
const getUsersEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter(({ type }) => type === UserActionType.GetUser),
    switchMap(() =>
      ajax<User[]>(`https://api.github.com/users?per_page=5`).pipe(
        map(({ response }) => new GetUsersSuccess(response)),
        catchError((err) => of(new GetUsersFail(err)))
      )
    )
  );

const getUserFailEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter(({ type }) => type === UserActionType.GetUserFail),
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

dispatch(new GetUsers());
```

#### With redux toolkit

##### https://redux-toolkit.js.org/api/createAction

##### https://redux-toolkit.js.org/api/createReducer

```
npm install @reduxjs/toolkit
```

```ts
import { Action, createAction, createReducer } from '@reduxjs/toolkit';
import { Observable, of, Subscription } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  filter,
  switchMap,
  map,
  catchError,
  tap,
  ignoreElements,
} from 'rxjs/operators';

// Model we want to work with
interface User {
  id: string;
  name: string;
}

// Actions
const getUsers = createAction('[Users] Get Users');
const getUserSuccess = createAction<User[]>('[Users] Get Users Success');
const getUsersFail = createAction<string>('[Users] Get Users Fail');

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
const usersReducer = createReducer(usersInitialState, (builder) =>
  builder
    .addCase(getUsers, (state) => ({
      ...state,
      loading: true,
      data: [],
      error: '',
    }))
    .addCase(getUserSuccess, (state, { payload }) => ({
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

// Side Effects
const getUsersEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter(getUsers.match),
    switchMap(() =>
      ajax<User[]>(`https://api.github.com/users?per_page=5`).pipe(
        map(({ response }) => getUserSuccess(response)),
        catchError((err) => of(getUsersFail(err)))
      )
    )
  );

const getUserFailEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter(getUsersFail.match),
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

#### With NgRx Store

```
npm install @ngrx/store --save
```

##### https://ngrx.io/guide/store/actions

##### https://ngrx.io/guide/store/reducers

```ts
import { Action, createAction, createReducer, on, props } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  filter,
  switchMap,
  map,
  catchError,
  tap,
  ignoreElements,
} from 'rxjs/operators';

// Model we want to work with
interface User {
  id: string;
  name: string;
}

// Actions
const getUsers = createAction('[Users] Get Users');
const getUserSuccess = createAction(
  '[Users] Get Users Success',
  props<{ payload: User[] }>()
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
    filter(({ type }) => type === getUsers.type),
    switchMap(() =>
      ajax<User[]>(`https://api.github.com/users?per_page=5`).pipe(
        map(({ response }) => getUserSuccess({ payload: response })),
        catchError((err) => of(getUsersFail({ payload: err })))
      )
    )
  );

const getUserFailEpic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter(({ type }) => type === getUsersFail.type),
    tap(({ payload }: any) => console.error(payload)),
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
