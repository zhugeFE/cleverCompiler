import { combineReducers } from "redux";
import { user } from "./user";
import { sys } from './sys'
import { git } from './git'
import { base } from './common'
const rootReducer = combineReducers({
  user,
  sys,
  git,
  base
})

export default rootReducer