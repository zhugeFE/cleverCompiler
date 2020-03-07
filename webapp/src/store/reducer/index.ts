import { combineReducers } from "redux";
import { user } from "./user";
import { sys } from './sys'
import { git } from './git'
const rootReducer = combineReducers({
  user,
  sys,
  git
})

export default rootReducer