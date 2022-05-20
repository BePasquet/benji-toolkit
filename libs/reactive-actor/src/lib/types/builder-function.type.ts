import { ReducerBuilder } from '../util/reducer-builder.model';

export type BuilderFunction<S> = (
  builder: ReducerBuilder<S>
) => ReducerBuilder<S>;
