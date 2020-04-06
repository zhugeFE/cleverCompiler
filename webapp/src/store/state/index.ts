import { SysState } from './sys';
import { UserState } from './user';
import { GitState } from './git'
import { BaseState } from './common';
export interface RootState {
  sys: SysState;
  user: UserState;
  git: GitState;
  base: BaseState;
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
  },
  base: {
    roleList: [],
    configTypes: []
  }
}

export default defaultState