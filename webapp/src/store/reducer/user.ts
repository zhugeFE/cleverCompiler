import ajax from "../../utils/ajax";
import { Action } from "redux";
import { userActions } from '../actionTypes'

interface UserState {
  current: object
}
const defaultState: UserState = {
  current: {
    name: 'zhangsan'
  }
}
// const User = {
//   login () {

//   }
// }
const user = function (state: UserState = defaultState, action: Action) {
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
  user,
  userActions
}