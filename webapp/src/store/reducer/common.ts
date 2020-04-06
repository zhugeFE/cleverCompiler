import defaultState from '../state'
import { BaseState } from '../state/common';
import { baseActions, Action } from '../actionTypes';
import * as _ from 'lodash';

const base = function (state: BaseState = defaultState.base, action: Action<any>) {
  switch (action.type) {
    case baseActions.SET_CONFIG_LIST:
      const res = _.clone(state)
      res.configTypes = action.value
      return res
    case baseActions.SET_ROLE_LIST:
      break;
    default:
      break;
  }
  return state
}
export {
  base
}