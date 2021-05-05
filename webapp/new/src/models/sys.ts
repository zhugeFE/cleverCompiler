import sysService from '@/services/sys';
import { Effect, Reducer } from '@/.umi/plugin-dva/connect';
import { ConfigType } from './common';

export type SysModelState = {
  configTypes: ConfigType[];
};

export type SysModelType = {
  namespace: 'sys';
  state: SysModelState;
  effects: {
    init: Effect;
    queryConfigTypes: Effect;
  };
  reducers: {
    setConfigTypes: Reducer<SysModelState>;
  };
};

const SysModel: SysModelType = {
  namespace: 'sys',

  state: {
    configTypes: []
  },

  effects: {
    *init({payload, callback}, { call}) {
      const res = yield call(sysService.init, payload);
      if (res.status !== -1) callback(res)
    },
    *queryConfigTypes(_, { call, put }) {
      const res = yield call(sysService.queryConfigTypes)
      if (res.status === -1) return
      yield put({
        type: 'setConfigTypes',
        payload: res.data
      })
    }
  },
  reducers: {
    setConfigTypes (state, {payload}) {
      return {
        configTypes: payload,
      }
    }
  },
};

export default SysModel;
