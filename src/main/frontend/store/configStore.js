import {configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import reducers from "./reducers";
import api from "./middleware/api";

const createStore = () => {
  return configureStore({
    reducer: reducers,
    middleware: [...getDefaultMiddleware(), api]
  });
}

export default createStore;