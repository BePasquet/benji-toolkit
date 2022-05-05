import {
  BehaviorSubject,
  distinctUntilChanged,
  EMPTY,
  filter,
  merge,
  scan,
  share,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

function routerActorSM(
  state: RouterActorState,
  event: Event
): RouterActorState {
  switch (state) {
    case RouterActorState.Active: {
      return event.type === RouterActorEvent.Stop
        ? RouterActorState.Inactive
        : state;
    }

    case RouterActorState.Inactive: {
      return event.type === RouterActorEvent.Start
        ? RouterActorState.Active
        : state;
    }
  }
}

export enum RouterActorEvent {
  Start = 'START',
  Stop = 'STOP',
  Destroy = 'DESTROY',
}

export enum RouterActorState {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

export interface Event {
  type: string;
}

export interface ActorRef<TEvent extends Event = Event> {
  name: string;
  send: (event: TEvent) => void;
}

export interface RouterActorChild<TEvent extends Event = Event> {
  events: Map<string, boolean>;
  ref: ActorRef<TEvent>;
}

export class RouterActor {
  /**
   * Main event stream where children are subscribed to
   */
  private readonly events$ = new Subject<Event>();

  /**
   * Actor state (multicaster)
   */
  private readonly state$ = this.events$.pipe(
    filter(
      ({ type }) =>
        type === RouterActorEvent.Start || type === RouterActorEvent.Stop
    ),
    scan(routerActorSM, RouterActorState.Inactive),
    distinctUntilChanged(),
    startWith(RouterActorState.Inactive),
    share({ connector: () => new BehaviorSubject(RouterActorState.Inactive) })
  );

  constructor(children: RouterActorChild[]) {
    /*
       Creates list of observables that when subscribed
       will listen to an event and match it to a child
       depending on the child events
    */
    const routing = children.map((child) =>
      this.events$.pipe(
        filter(({ type }) => child.events.has(type)),
        tap((ev) => child.ref.send(ev))
      )
    );

    /*
        When state active switches and subscribes to all routing otherwise 
        completes unsubscribing from routing will live till actor 
        receives destroy message
    */
    const connect$ = this.state$.pipe(
      switchMap((state) =>
        state === RouterActorState.Active ? merge(...routing) : EMPTY
      ),
      takeUntil(
        this.events$.pipe(
          filter(({ type }) => type === RouterActorEvent.Destroy)
        )
      )
    );

    connect$.subscribe();
  }

  /**
   * Allows to send an event to the actor
   * @param ev Event
   */
  send(ev: Event): void {
    this.events$.next(ev);
  }
}
