import {combineReducers} from "redux";
import auth from "./auth/auth";
import entities from "./entities/entities";

export default combineReducers({
  entities,
  auth
  //ui
});
