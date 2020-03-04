export enum userActions {
  UPDATE_CURRENT = 'UPDATE_CURRENT',
  LOGGIN = 'LOGGIN'
}
export interface Action {
  type: string,
  value: any
}