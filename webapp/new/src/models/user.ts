import userService from '@/services/user';
import type { Effect, Reducer } from 'umi';

export type CurrentUser = {
  id: string,
  name: string,
  email: string,
  roleId: string,
  roleName: string
};

export type UserModelState = {
  currentUser: CurrentUser | null;
};

export type UserModelType = {
  namespace: 'user';
  state: UserModelState;
  effects: {
    login: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
  };
};

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: null,
  },

  effects: {
    *login({payload}, { call, put }) {
      const res = yield call(userService.login, payload);
      yield put({
        type: 'saveCurrentUser',
        payload: res.data,
      });
    }
  },
  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    }
  },
};

export default UserModel;
