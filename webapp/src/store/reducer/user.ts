import { Action } from "redux";
import { userActions } from '../actionTypes'
import defaultState, { RootState } from '../state'

const user = function (state: RootState = defaultState, action: Action) {
  switch (action.type) {
    case userActions.UPDATE_CURRENT:
      return {
        current: {
          name: '李四'
        }
      }
    default:
      return state
  }
}
export {
  user
}