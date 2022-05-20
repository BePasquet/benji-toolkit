export type ActionCreator<T> = {
  (payload?: T): {
    type: string;
    payload: T;
  };
  type: string;
};
