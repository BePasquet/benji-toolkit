import { GraphNode } from '@benji-toolkit/data-structures';
import {
  Actor,
  createEvent,
  ofType,
  stop,
} from '@benji-toolkit/reactive-actor';
import { catchError, defer, map, mergeMap, of, takeUntil, tap } from 'rxjs';
import { WebSocketServer } from 'ws';

export class Environment {}

const messageReceived = createEvent('[Sense] External Message');

export class Sense extends Actor {
  private readonly wss = new WebSocketServer({ port: 8080 });

  readonly external$ = this.messages$.pipe(
    ofType(messageReceived),
    map(({ payload }) => payload)
  );

  constructor() {
    super('sense');

    this.wss.on('connection', (ws) => {
      ws.on('error', console.error);
      ws.on('message', (data) => this.send(messageReceived(data)));
    });
  }
}

export interface Pattern<T = unknown> {
  name: string;
  data: T;
}

export const start = createEvent('[Brain] Start');

export const predict = createEvent<Pattern>('[Brain] Recognize Pattern ');

export const predictionSuccess = createEvent<Pattern>('[Brain] Prediction');

export const predictionFail = createEvent<string>('[Brain] Prediction');

export interface Model {
  predict(data: any): Promise<number>;
}

export class Models {
  constructor(private readonly models: Map<string, GraphNode<Model>>) {}

  find(name: string): Model | null {
    return this.models.get(name)?.value ?? null;
  }
}

export class Brain extends Actor {
  private readonly connectSense$ = this.sense.external$.pipe(
    tap(({ payload }) => this.send(predict(payload))),
    takeUntil(this.stop$)
  );

  private readonly prediction$ = this.messages$.pipe(
    ofType(predict),
    mergeMap(({ payload: { name, data } }) => {
      const model = this.models.find(name);
      return model
        ? defer(() => model.predict(data)).pipe(
            map((data) => predictionSuccess({ name, data })),
            catchError((err) => of(predictionFail(err)))
          )
        : of(predictionFail('MODEL_NOT_FOUND'));
    })
  );

  constructor(private readonly sense: Sense, private models: Models) {
    super('brain');
    this.connectSense$.subscribe();
    this.answer(this.prediction$);
  }
}

export class Entity {
  constructor(
    private readonly environment: Environment,
    private readonly brain: Brain
  ) {}
  start(): void {
    this.brain.send(start(null));
  }

  stop(): void {
    this.brain.send(stop(null));
  }
}
