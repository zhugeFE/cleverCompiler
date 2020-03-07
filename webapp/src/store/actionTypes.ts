export enum userActions {
  UPDATE_CURRENT = 'UPDATE_CURRENT'
}
export enum gitActions {
  UPDATE_LIST = 'UPDATE_LIST'
}
export interface Action<T> {
  type: string,
  value: T
}