import { createStore } from "redux";
import rootReducer from "./reducer/index";

const store = createStore(rootReducer)
export default store