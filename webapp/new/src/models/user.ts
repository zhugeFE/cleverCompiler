import userService from '@/services/user';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
import { Effect, history, Reducer } from 'umi';

function afterLogin () {
  const urlParams = new URL(window.location.href);
  const params = getPageQuery();
  message.success('🎉 🎉 🎉  登录成功！');
  let { redirect } = params as { redirect: string };
  if (redirect) {
    const redirectUrlParams = new URL(redirect);
    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);
      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#') + 1);
      }
    } else {
      window.location.href = '/';
      return;
    }
  }
  history.replace(redirect || '/');
}

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
      if (res.status === -1) return
      yield put({
        type: 'saveCurrentUser',
        payload: res.data,
      });
      afterLogin()
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
