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
    *init({payload, callback}, { call}) {
      const res = yield call(sysService.init, payload);
      if (res.status !== -1) callback(res)
    }
  },
  reducers: {
    
  },
};

export default UserModel;
