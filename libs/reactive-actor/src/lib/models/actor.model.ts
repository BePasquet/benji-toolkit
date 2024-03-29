import {
  BehaviorSubject,
  merge,
  Observable,
  OperatorFunction,
  scan,
  share,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { AnswerConfig, Event } from '../interfaces';
import { ofType } from '../operators/of-type.operator';
import { Reducer } from '../types';
import { ActorEvent } from '../types/actor-event.type';
import { createEvent } from '../util';

export const stop = createEvent('REACTIVE_ACTOR_STOP');

/**
 * Reference:
 * https://www.youtube.com/watch?v=7erJ1DV_Tlo&ab_channel=jasonofthel33t
 *
 * Actor:
 * Fundamental unit of computation
 * Actor needs to embody
 * - Processing
 * - Storage
 * - Communication
 *
 * "One ant is no ant" - "One human is no human" - "One actor is no actor"
 * Actors live within systems
 *
 * Fundamental Properties:
 * - Receive messages, in response of this it can"
 *   - Create actors
 *   - Send messages (to other actors and itself)
 *   - Designates what to do with the next message it receives
 */
export class Actor<TMessage extends ActorEvent = ActorEvent> {
  private readonly message$ = new Subject<TMessage>();

  /**
   * Stream of stop events (might be useful to know when the actor stops)
   */
  readonly stop$ = this.message$.pipe(ofType(stop));

  constructor(public address: string) {}

  /**
   * Method to send messages to the actor
   * @param message we want to send to the actor
   */
  send(message: TMessage): void {
    this.message$.next(message);
  }

  /**
   * Subscribes to an observable of events when there is an emission will send the event to a
   * recipient (actor reference) when specified and to itself when not.
   * completes when stop message is send to the actor.
   * @param messages an observable of messages
   * @example
   *
   * import { Actor, createEvent } from 'reactive-actor';
   *
   * export const getUsers = createEvent('[Users] Get Users');
   *
   * export const getUsersSuccess = createEvent<GitHubUser[]>(
   *   '[Users] Get Users Success'
   * );
   *
   * export const getUsersFail = createEvent<string>('[Users] Get Users Fail');
   *
   *
   * export type UsersActorEvents = ReturnType<typeof getUsers>;
   *
   * export class UsersActor extends Actor<UsersActorEvents> {
   *   // Reference to logger actor
   *   private readonly logger = new Actor('logger');
   *
   *   // Recipient is not define thus will send the resulting event to itself
   *   private readonly getUsers$ = this.messages$.pipe(
   *     ofType(getUsers),
   *     exhaustMap(() =>
   *       ajax<GitHubUser[]>(`https://api.github.com/users?per_page=5`).pipe(
   *         map(({ response }) => getUsersSuccess(response)),
   *         catchError((err) => of(getUsersFail(err)))
   *       )
   *     )
   *   );
   *
   *   // Recipient is define thus will send event (getUsersFail) to specified recipient (logger)
   *   private readonly getUsersFail$ = this.messages$.pipe(
   *     ofType(getUsersFail),
   *     addRecipient(this.logger)
   *   );
   *
   *   constructor() {
   *     super('users');
   *     this.answer(this.getUsers$, this.getUsersFail$);
   *   }
   * }
   */
  protected answer(...messages: Observable<Event & AnswerConfig>[]): void {
    const answers$ = merge(...messages).pipe(
      tap(({ recipient, ...message }) =>
        recipient ? recipient.send(message) : this.send(message as TMessage)
      ),
      takeUntil(this.stop$)
    );

    answers$.subscribe();
  }

  /**
   * Actor message stream, allows to define actor behavior
   * see [example](https://www.npmjs.com/package/reactive-actor)
   */
  protected get messages$(): Observable<TMessage> {
    return this.message$.asObservable();
  }
}

/**
 * Represents a state machine defined as a dictionary where states are keys
 * and values are dictionary where events are keys and next state values
 */
export type EventStateMachineStructure<
  TState extends StateMachineState,
  TInput extends Event
> = Partial<Record<TState, Partial<Record<TInput['type'] | string, TState>>>>;

/**
 * Type synonym for state machine keys
 */
export type StateMachineState = string | number;

/**
 * Creates an event reducer from a state machine defined as a dictionary see: ``EventStateMachineStructure``
 * @param stateMachine a state machine defined as a dictionary
 * @returns reducer function that process the next state based on current state and an event
 */
export function createStateMachineReducer<
  TState extends StateMachineState,
  TInput extends Event
>(
  stateMachine: EventStateMachineStructure<TState, TInput>
): Reducer<TState, TInput> {
  return (state: TState, message: TInput) =>
    stateMachine[state]?.[message.type] ?? state;
}

/**
 * Creates a function that once applied to a stream of events will reduce state and events over time
 * similar to rxjs ``scan`` operator but will multicast values to subscribers
 * @param reducer - a function with the form of ``(state: TState, event: TEvent) => TState``
 * ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 * @param initialState state that will be reduced will the first event or state at time 0
 * @returns operator function to reduce state and events over time
 */
export function eventReducer<TState, TMessage>(
  reducer: Reducer<TState, TMessage>,
  initialState: TState
) {
  return (source$: Observable<TMessage>) =>
    source$.pipe(
      scan(reducer, initialState),
      share({ connector: () => new BehaviorSubject(initialState) })
    );
}

/**
 * Creates a function that once applied to a stream of events will reduce state and events over time
 * similar to rxjs ``scan`` operator but will multicast values to subscribers
 * @param stateMachine a state machine defined as a dictionary see: ``EventStateMachineStructure``
 * @param initialState state that will be reduced will the first event or state at time 0
 * @returns operator function to reduce state and events over time
 */
export function eventStateMachine<
  TState extends StateMachineState,
  TMessage extends Event
>(
  stateMachine: EventStateMachineStructure<TState, TMessage>,
  initialState: TState
): OperatorFunction<TMessage, TState> {
  return eventReducer(createStateMachineReducer(stateMachine), initialState);
}
