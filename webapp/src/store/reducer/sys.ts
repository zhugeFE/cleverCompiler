import { Action } from 'redux'
import defaultState, { RootState } from '../state'
const sys = function (state: RootState = defaultState, action: Action) {
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