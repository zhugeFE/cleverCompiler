import { Action } from "../actionTypes";
import { userActions } from '../actionTypes'
import defaultState, { RootState } from '../state'

const user = function (state: RootState = defaultState, action: Action) {
  let userState = Object.assign(defaultState.user)
  switch (action.type) {
    case userActions.UPDATE_CURRENT:
      return {
        current: {
          name: '李四'
        }
      }
    case userActions.LOGGIN:
      userState = Object.assign({
        currentUser: action.value
      }, userState)
      return Object.assign(userState, defaultState)
    default:
      return state
  }
}
export {
  user
}