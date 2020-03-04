export interface UserState {
  id: string,
  name: string,
  email: string,
  roleId: string,
  roleName: string
}
export interface SysState {
  isInited: boolean,
  logged: boolean
}
export interface RootState {
  sys: SysState,
  user: {
    current: UserState
  }
}
const defaultState: RootState = {
  sys: {
    isInited: false,
    logged: false
  },
  user: {
    current: null
  }
}

export default defaultState