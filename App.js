import { StatusBar } from "expo-status-bar";
import React from "react";
import { Provider } from "react-redux";
import AccountNavigator from "./navigation/accountNavigation";
import { combineReducers, createStore } from "redux";
import accountReducer from "./store/reducers/account";

import GroupsScreen from "./screens/GroupsScreen";

export default function App() {
  const rootReducer = combineReducers({ accoutn: accountReducer });
  const store = createStore(rootReducer);

  return (
    // <Provider store={store}>
    //   <StatusBar style='auto' />
    //   <AccountNavigator></AccountNavigator>
    // </Provider>
    <GroupsScreen />
  );
}
