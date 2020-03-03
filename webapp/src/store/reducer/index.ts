import { combineReducers } from "redux";
import { user } from "./user";
import { sys } from './sys'
const rootReducer = combineReducers({
  user,
  sys
})

export default rootReducer