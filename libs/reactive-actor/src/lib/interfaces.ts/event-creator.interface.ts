export interface EventCreator<T> {
  (payload: T): {
    type: string;
    payload: T;
  };
  type: string;
}
