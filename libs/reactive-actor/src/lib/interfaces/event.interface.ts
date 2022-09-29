/**
 * Message are implemented with a type
 * to understand what message is
 */
export interface Event<T = any> {
  type: string;
  payload: T;
}
