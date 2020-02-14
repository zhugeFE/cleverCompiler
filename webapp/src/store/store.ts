import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducer/index";
import { createLogger } from 'redux-logger'
const logger = createLogger()
const store = createStore(rootReducer, applyMiddleware(
  logger
))
export default store