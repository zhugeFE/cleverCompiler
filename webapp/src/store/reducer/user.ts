import { Action, userActions } from '../actionTypes'
import defaultState, { UserState, User } from '../state'

const user = function (state: UserState = defaultState.user, action: Action<User>) {
  switch (action.type) {
    case userActions.UPDATE_CURRENT:
      const res = Object.assign(state, {
        current: action.value
      })
      return res
    default:
      return state
  }
}
export {
  user
}