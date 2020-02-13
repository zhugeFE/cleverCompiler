interface UserState {
  current: object
}
enum userActions {
  getCurrent,
  updateCurrent
}
interface UserAction {
  type: userActions
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
const user = function (state: UserState = defaultState, action: UserAction) {
  switch (action.type) {
    case userActions.updateCurrent:
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