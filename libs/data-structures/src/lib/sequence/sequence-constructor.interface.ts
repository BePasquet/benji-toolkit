import { Sequence } from './sequence.interface';

export interface SequenceConstructor {
  new (): Sequence<number>;
}
