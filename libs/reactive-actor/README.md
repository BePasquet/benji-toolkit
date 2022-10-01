# Installation

```
npm i reactive-actor rxjs
```

# Overview

Docs are a work in progress, a basic introduction has been added to give an idea of how the package works.

## Introduction

Reactive actor is a library for developing systems based on the actor model. It's built on top of rxjs, an utility library to develop reactive systems by doing this it's api exposes rxjs observables allowing functional composition through pipes and operators.

Reactive Actor combines the actor model, with reactive functional programming to allow the development of individual units of computation with a predictable way of managing events (messages) through time.

### Fundamental Concepts

#### Actor:

Fundamental unit of computation, needs to embody ([reference](https://www.youtube.com/watch?v=7erJ1DV_Tlo&ab_channel=jasonofthel33t))

- Processing
- Storage
- Communication

Fundamental Properties:

- Receive messages
- Create actors
- Send messages (to itself and other actors)
- Designate what to do with the next message it receives

"One ant is no ant" - "One human is no human" - "One actor is no actor"
Actors live within systems

#### Observable:

A collection of events over time ([reference](https://rxjs.dev/guide/observable))

#### Operators:

Functions, within rxjs context operators are functions that take an observable as input and return an observable as output ([reference](https://rxjs.dev/guide/operators))

### Conceptualizing Actors

An analogy that can help to understand actors are humans: <br />
As humans we live within communities (systems) and communicate between each other (messages), when someone interacts with in response to that interaction we can decide to change our internal state of mind and answer or ignore.

For example lets consider the situation where there are two persons (person A and person B) and person B is feeling lonely, person A greet person B and in response to this person B changes it's internal state from lonely to happy and greet back.

<br /><br />

![alt example person talking to another](https://raw.githubusercontent.com/BePasquet/benji-toolkit/feature_reactive_actor_docs/apps/reactive-actor-docs/static/img/example-person-taking-to-another.png)

<br /><br />

Lets model this interaction:

### Example

```
import {
  Actor,
  createEvent,
  createStateMachineReducer,
  eventReducer,
  EventStateMachineStructure,
  stop,
  ofType
} from '@benji-toolkit/reactive-actor';
import { map, takeUntil } from 'rxjs';

// Greet event creator
export const greet = createEvent<string>('Greet');

// Messages that the person accepts
export type PersonMessage = ReturnType<typeof greet>;

export enum PersonState {
  Lonely = 'LONELY',
  Happy = 'HAPPY',
}

// Define transition from one state to another
const personStateMachine: EventStateMachineStructure<
  PersonState,
  PersonMessage
> = {
  [PersonState.Lonely]: {
    [greet.type]: PersonState.Happy,
  },
};

// Creates a reducer based on the transitions previously defined
const personReducer = createStateMachineReducer(personStateMachine);

// Defines person a actor that extends reactive actor, actor base class
export class PersonA extends Actor<PersonMessage> {
  constructor() {
    super('personA');
  }
}

// Defines person b actor that extends reactive actor, actor base class
export class PersonB extends Actor<PersonMessage> {
  /*
     Defines a stream of state that can be subscribed to, (will broadcast state changes)
     Every time the actor receives an event will run the person reducer with the current state and the event and when
     the state changes will emit it to the state subscribers
  */
  readonly state$ = this.messages$.pipe(
    eventReducer(personReducer, PersonState.Lonely),
    takeUntil(this.stop$)
  );

  // Defines the what the actor will do in response to the greet event
  private readonly greet$ = this.messages$.pipe(
    map(({ sender }) => greet('Good and you?', sender))
  );

  constructor() {
    super('personB');
    // Subscribes to the state event to avoid late subscribers
    this.state$.subscribe();
    // Used to subscribe to interaction when adding a recipient the event will be sent to it when not will be send to itself
    this.answer(this.greet$);
  }
}

// Creates an instance of person a
const personA = new PersonA();

// Creates an instance of person b
const personB = new PersonB();

// Subscribes to person b state event stream
personB.state$.subscribe(console.log);
// Logs: LONELY, HAPPY

personB.send(greet('Hi how are you', personA));


```

<br /><br />

### A more realistic example

In this example we will model an actor that encapsulate logic related to users and uses the redux pattern to manage state.

```
import {
  Actor,
  createEvent,
  createReducer,
  eventReducer,
  ofType,
} from 'reactive-actor';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, exhaustMap, map, takeUntil, tap } from 'rxjs/operators';

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

```

<br /><br />

### React example

Let's see how we can interact with the users actor within react, get and show github users.

```
import { stop } from 'reactive-actor';
<!-- path from repository same as defined above -->
import {
  getUsers,
  UsersActor,
  usersInitialState,
  UsersState,
} from '@benji-toolkit/users';
import { useEffect, useRef, useState } from 'react';

export function App() {
  // Interoperability between actor state and react
  const [state, setState] = useState<UsersState>(usersInitialState);
  // Actor reference
  const usersActor = useRef(new UsersActor()).current;

  useEffect(() => {
    // subscribes to state state changes
    const subscription = usersActor.state$.subscribe(setState);

    return () => {
      // clean local subscriptions
      subscription.unsubscribe();
      // stops actor used to clean internal subscriptions
      usersActor.send(stop(null));
    };
  }, [usersActor]);

  const fetchUsers = () => usersActor.send(getUsers(null));

  return (
    <div>
      <h1>Reactive Actor React Example</h1>
      <div>
        <button onClick={fetchUsers}>Fetch users</button>
      </div>

      <code>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </code>
    </div>
  );
}
```
