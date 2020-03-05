export enum userActions {
  UPDATE_CURRENT = 'UPDATE_CURRENT'
}
export interface Action<T> {
  type: string,
  value: T
}