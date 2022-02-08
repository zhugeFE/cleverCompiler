/*
 * @Descripttion: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2021-11-05 20:08:04
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-01-10 22:02:47
 */
import userService from '@/services/user';
import util, { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
import type { Effect, Reducer } from 'umi';
import { history } from 'umi';

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

export type User = {
  id: string,
  name: string,
  email: string,
  roleId: string,
  roleName: string
};


export type UserModelState = {
  currentUser: CurrentUser | null;
  userList?: User[]
};

export type UserModelType = {
  namespace: 'user';
  state: UserModelState;
  effects: {
    query: Effect;
    login: Effect;
    logout: Effect;
    regist: Effect;
    checkName: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveUserList: Reducer<UserModelState>;
    saveCurrentUser: Reducer<UserModelState>;
  };
};

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: null,
  },

  effects: {
    *query({}, {call,put}) {
      const res = yield call( userService.list)
      if (res.status === -1) return
      yield put({
        type: 'saveUserList',
        payload: res.data
      })
    },
    *login({payload}, { call, put }) {      
      const res = yield call(userService.login, payload);
      if (res.status === -1) return      
      yield put({
        type: 'saveCurrentUser',
        payload: res.data,
      });
      afterLogin()
    },
    *regist( {payload}, {call,put}) {
      const res =  yield call(userService.regist, payload)
      if (res.status === -1) return
      message.success('🎉 🎉 🎉  注册成功！')
      yield put({
        type: 'login',
        payload: {
          username: payload.email,
          password: payload.password
        }
      })
    },
    *checkName( {payload,callback}, {call}) {      
      const res = yield call(userService.checkName, payload)
      if (res.status === -1) return
      if (callback) callback(res.data)
    },
    *logout({}, {put}) {
      yield put({
        type: 'saveCurrentUser',
        payload: null
      })
    },
    *fetchCurrent(_, { call, put }) {
      const res = yield call(userService.getCurrent)
      if (res.status === -1) return
      yield put({
        type: 'saveCurrentUser',
        payload: res.data,
      });
    }
  },
  reducers: {
    saveUserList(state, {payload}): UserModelState {
      const res =  util.clone(state)!
      res.userList = payload
      return res
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    }
  },
};

export default UserModel;
