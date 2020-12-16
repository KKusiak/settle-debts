import { StatusBar } from "expo-status-bar";
import React from "react";
import { Provider } from "react-redux";
import MainNavigator from "./navigation/accountNavigation";
import accountReducer from "./store/reducers/account";
import groupsReducer from "./store/reducers/groups";
import operationsReducer from "./store/reducers/operations";
import usersReducer from "./store/reducers/user";
import expendituresReducer from "./store/reducers/expenditures";
import { combineReducers, createStore, applyMiddleware } from "redux";
import { fbConfig } from "./config/FirebaseConfig";
import thunk from "redux-thunk";
import firebase from "firebase/app";
import "firebase/auth";
export default function App() {
  if (!firebase.apps.length) {
    firebase.initializeApp(fbConfig);
    firebase.firestore();
  }

  const rootReducer = combineReducers({
    account: accountReducer,
    groups: groupsReducer,
    operations: operationsReducer,
    users: usersReducer,
    expenditures: expendituresReducer,
  });
  const store = createStore(rootReducer, applyMiddleware(thunk));
  return (
    <Provider store={store}>
      <StatusBar style='auto' />
      <MainNavigator />
    </Provider>
  );
}
