import { SysState } from './sys';
import { UserState } from './user';
import { GitState } from './git'
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