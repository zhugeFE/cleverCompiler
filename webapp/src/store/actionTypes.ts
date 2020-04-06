export enum userActions {
  UPDATE_CURRENT = 'UPDATE_CURRENT'
}
export enum gitActions {
  UPDATE_LIST = 'UPDATE_LIST'
}
export enum baseActions {
  SET_ROLE_LIST = 'SET_ROLE_LIST',
  SET_CONFIG_LIST = 'SET_CONFIG_LIST'
}
export interface Action<T> {
  type: string,
  value: T
}