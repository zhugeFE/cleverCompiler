export interface User {
  id: string,
  name: string,
  email: string,
  roleId: string,
  roleName: string
}
export interface UserState {
  current: User
}
export interface SysState {
  isInited: boolean,
  logged: boolean
}
export interface GitInstance {

}
export interface GitState {
  list: GitInstance[]
}
export interface RootState {
  sys: SysState,
  user: UserState,
  git: GitState
}
const defaultState: RootState = {
  sys: {
    isInited: false,
    logged: false
  },
  user: {
    current: null
  },
  git: {
    list: []
  }
}

export default defaultState