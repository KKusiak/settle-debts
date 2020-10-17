import { StatusBar } from "expo-status-bar";
import React from "react";
import { Provider } from "react-redux";
import MainNavigator from "./navigation/accountNavigation";
import accountReducer from "./store/reducers/account";
import groupsReducer from "./store/reducers/groups";
import operationsReducer from "./store/reducers/operations";
import usersReducer from "./store/reducers/user";

import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import firebase from "firebase/app";
import "firebase/auth";
export default function App() {
  const fbConfig = {
    apiKey: "AIzaSyDgnjNh1Ih3dcecgEbnM8yKdIb_CAMGat0",
    authDomain: "settleup-85b43.firebaseapp.com",
    databaseURL: "https://settleup-85b43.firebaseio.com",
    projectId: "settleup-85b43",
    storageBucket: "settleup-85b43.appspot.com",
    messagingSenderId: "409124269870",
    appId: "1:409124269870:web:c161699a0d362515c794bf",
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(fbConfig);
    firebase.firestore();
  }

  const rootReducer = combineReducers({
    account: accountReducer,
    groups: groupsReducer,
    operations: operationsReducer,
    users: usersReducer,
  });
  const store = createStore(rootReducer, applyMiddleware(thunk));
  return (
    <Provider store={store}>
      <StatusBar style='auto' />
      <MainNavigator />
    </Provider>
  );
}
