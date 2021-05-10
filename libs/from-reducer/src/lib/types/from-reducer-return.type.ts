import { Observable, UnaryFunction } from 'rxjs';
import { Epic } from './epic.type';
import { VariadicFunction } from './variadic-function.type';

export type FromReducerReturnType<T, S> = [
  Observable<S>,
  UnaryFunction<T, void>,
  VariadicFunction<Epic<T, S>[], Observable<T>>
];
