import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers";
import thunk from "redux-thunk";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";

const persistConfig = {
  key: "root",
  storage
};
const logger = store => next => action => {
  console.group(action.type);
  console.info("dispatching", action);
  if (typeof action !== "function") {
    console.log("dispatching:", action);
  }
  let result = next(action);
  console.log("next state", store.getState());
  console.groupEnd(action.type);
  return result;
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const loggerMiddleware = createLogger({ collapsed: true });
export default () => {
  let store = createStore(
    persistedReducer,
    applyMiddleware(thunk, loggerMiddleware, logger)
  );
  let persistor = persistStore(store);
  let tool = composeWithDevTools();
  return { store, persistor, tool };
};
