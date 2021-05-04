import { MonoTypeOperatorFunction, Observable, UnaryFunction } from "rxjs";
import { VariadicFunction } from "./variadic-function.type";

export type FromReducerReturnType<T, S> = [
  Observable<S>,
  UnaryFunction<T, void>,
  VariadicFunction<MonoTypeOperatorFunction<T>[], Observable<T>>
];
