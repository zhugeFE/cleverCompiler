export enum userActions {
  UPDATE_CURRENT = 'UPDATE_CURRENT',
  LOGIN = 'LOGIN'
}
export interface Action<T> {
  type: string,
  value: T
}