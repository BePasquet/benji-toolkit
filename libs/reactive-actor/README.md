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
    eventReducer(personReducer, PersonState.Lonely)
  );

  // Defines the what the actor will do in response to the greet event
  private readonly greet$ = this.messages$.pipe(
    map(({ sender }) => greet('Good and you?', sender))
  );

  constructor() {
    super('personB');
    // Subscribes to the state event to avoid late subscribers (till a stop message is send to the actor)
    this.state$.pipe(takeUntil(this.messages$.pipe(ofType(stop)))).subscribe();
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
