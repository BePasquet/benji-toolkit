import {
  Actor,
  createEvent,
  createReducer,
  eventReducer,
  ofType,
} from '@benji-toolkit/reactive-actor';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, exhaustMap, map, takeUntil, tap } from 'rxjs/operators';
import { GitHubUser } from './github-user.interface';

export interface UsersState {
  data: GitHubUser[];
  loading: boolean;
  error: string;
}

// Defines events

export const getUsers = createEvent('[Users] Get Users');

export const getUsersSuccess = createEvent<GitHubUser[]>(
  '[Users] Get Users Success'
);

export const getUsersFail = createEvent<string>('[Users] Get Users Fail');

// Defines initial state

export const usersInitialState: UsersState = {
  loading: false,
  data: [],
  error: '',
};

// Defines reducer

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

// Defines events accepted by user actor
export type UsersActorEvents = ReturnType<typeof getUsers>;

// Defines actor
export class UsersActor extends Actor<UsersActorEvents> {
  readonly state$ = this.messages$.pipe(
    // operate over stream of messages and reduce state and event over time
    eventReducer(usersReducer, usersInitialState),
    // completes when stop event is send to the actor
    takeUntil(this.stop$)
  );

  // Defines get users effect
  private readonly getUsers$ = this.messages$.pipe(
    ofType(getUsers),
    exhaustMap(() =>
      ajax<GitHubUser[]>(`https://api.github.com/users?per_page=5`).pipe(
        map(({ response }) => getUsersSuccess(response)),
        catchError((err) => of(getUsersFail(err)))
      )
    )
  );

  // Defines an effect that doesn't send a new message
  private readonly getUsersFail$ = this.messages$.pipe(
    ofType(getUsersFail),
    tap(({ payload }) => console.log(payload)),
    // completes when stop event is send to the actor
    takeUntil(this.stop$)
  );

  constructor() {
    super('users');
    // Subscribes to get users and send back to actor resulting event (getUsersSuccess, getUsersFail)
    this.answer(this.getUsers$);
    // Subscribes to state stream will complete when stop message is send to the actor (see operator takeUntil(this.stop$))
    this.state$.subscribe();
    // Subscribes to log errors on get users fail will complete when stop message is send to the actor (see operator takeUntil(this.stop$))
    this.getUsersFail$.subscribe();
  }
}
