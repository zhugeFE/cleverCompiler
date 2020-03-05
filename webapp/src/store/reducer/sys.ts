import { Action } from 'redux'
import defaultState, { SysState } from '../state'
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