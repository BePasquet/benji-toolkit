/* eslint-disable */
// disable eslint to be able to infer any type
export type VariadicFunction<T extends any[], R> = (...args: T) => R;
