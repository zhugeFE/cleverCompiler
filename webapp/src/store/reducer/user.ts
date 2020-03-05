import { Action, userActions } from '../actionTypes'
import defaultState, { UserState, User } from '../state'
import * as _ from 'lodash'

const user = function (state: UserState = defaultState.user, action: Action<User>) {
  switch (action.type) {
    case userActions.UPDATE_CURRENT:
      return _.assign(_.cloneDeep(state), {
        current: action.value
      })
    default:
      return state
  }
}
export {
  user
}