import {
  BehaviorSubject,
  distinctUntilChanged,
  Observable,
  OperatorFunction,
  scan,
  share,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { ofType } from '../operators';
import { Reducer } from '../types';
import { createEvent } from '../util';

export const stop = createEvent('REACTIVE_ACTOR_STOP');

/**
 * Message are implemented with a type
 * to understand what message is
 */
export interface Event {
  type: string;
}

export interface AnswerConfig {
  to?: string | string[];
}

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
export class Actor<TMessage extends Event = Event> {
  protected readonly messages$ = new Subject<TMessage>();

  protected readonly children = new Map<string, Actor>();

  constructor(public address: string) {}

  send(message: TMessage): void {
    this.messages$.next(message);
  }

  protected spawn(actor: Actor): void {
    this.children.set(actor.address, actor);
  }

  protected answer(message$: Observable<TMessage & AnswerConfig>): void {
    const answer$ = message$.pipe(
      tap(({ to, ...message }) =>
        !to
          ? this.send(message as TMessage)
          : typeof to === 'string'
          ? this.children.get(to)?.send(message)
          : to.forEach((address) => this.children.get(address)?.send(message))
      ),
      takeUntil(this.messages$.pipe(ofType(stop)))
    );

    answer$.subscribe();
  }
}

/**
 * Represents a state machine defined as a dictionary where states are keys
 * and values are dictionary where events are keys and next state values
 */
export type EventStateMachineStructure<
  TState extends StateMachineState,
  TInput extends Event
> = Partial<Record<TState, Partial<Record<TInput['type'], TState>>>>;

/**
 * Type synonym for state machine keys
 */
export type StateMachineState = string | number;

/**
 * Creates an event reducer from a state machine defined as a dictionary see: ``EventStateMachineStructure``
 * @param stateMachine a state machine defined as a dictionary
 * @returns reducer function that process the next state based on current state and an event
 */
export function stateMachineReducer<
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
      share({ connector: () => new BehaviorSubject(initialState) }),
      distinctUntilChanged()
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
  return eventReducer(stateMachineReducer(stateMachine), initialState);
}

/**
 * An actor with state for more info see ``Actor``
 */
export class StateFulActor<
  TMessage extends Event,
  TState extends StateMachineState
> extends Actor<TMessage> {
  /**
   * Stream of state (broadcast messages)
   */
  readonly state$: Observable<TState>;

  /**
   * @param address actor address
   * @param stateMachine state machine structure that will be used to create reducer function that will output next state
   * @param initialState state machine initial state
   */
  constructor(
    address: string,
    stateMachine: EventStateMachineStructure<TState, TMessage>,
    initialState: TState
  ) {
    super(address);

    this.state$ = this.messages$.pipe(
      eventStateMachine(stateMachine, initialState)
    );
  }
}
