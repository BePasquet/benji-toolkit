export interface BaseEntityState<E = string> {
  loading: boolean;
  loaded: boolean;
  error: E;
}
