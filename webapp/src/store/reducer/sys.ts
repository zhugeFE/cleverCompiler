import { Action } from 'redux'
import defaultState from '../state'
import { SysState } from '../state/sys';

const sys = function (state: SysState = defaultState.sys, action: Action) {
  switch (action.type) {
    case '-':
      break;
    default:
      break;
  }
  return state
}
export {
  sys
}