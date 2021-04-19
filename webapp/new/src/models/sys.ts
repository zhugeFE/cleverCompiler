import sysService from '@/services/sys';
import type { Effect } from 'umi';

export type SysModelState = {
  
};

export type SysModelType = {
  namespace: 'sys';
  state: SysModelState;
  effects: {
    init: Effect;
  };
  reducers: {
    
  };
};

const UserModel: SysModelType = {
  namespace: 'sys',

  state: {
    
  },

  effects: {
    *init({payload}, { call}) {
      yield call(sysService.init, payload);
    }
  },
  reducers: {
    
  },
};

export default UserModel;
