import { Sequence } from './sequence.interface';

export interface SequenceConstructor<T> {
  new (): Sequence<T>;
}
