import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import GroupsScreen from "../screens/GroupsScreen";
import OperationsScreen from "../screens/Group/OperationsScreen";
import BalanceScreen from "../screens/Group/BalanceScreen";
import OperationDetailsScreen from "../screens/Group/OperationDetailsScreen";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import Colors from "../constants/Colors";
const GroupStack = createStackNavigator();
const GroupTabs = createBottomTabNavigator();
const AccountStack = createStackNavigator();
const MainNavigator = createStackNavigator();
const OperationStack = createStackNavigator();
function OperationStackSetup() {
  return (
    <OperationStack.Navigator initialRouteName='Operations'>
      <OperationStack.Screen name='Operations' component={OperationsScreen} />
      <OperationStack.Screen
        name='OperationDetails'
        component={OperationDetailsScreen}
      />
    </OperationStack.Navigator>
  );
}
function GroupTabsSetup() {
  return (
    <GroupTabs.Navigator
      initialRouteName='Operations'
      tabBarOptions={{
        activeTintColor: Colors.primary,
        inactiveTintColor: Colors.gray,
      }}
      backBehavior='none'>
      <GroupTabs.Screen
        name='Operations'
        component={OperationStackSetup}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name='receipt' size={24} color={color} />
          ),
        }}
      />
      <GroupTabs.Screen
        name='Balance'
        component={BalanceScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name='dollar' size={24} color={color} />
          ),
        }}
      />
    </GroupTabs.Navigator>
  );
}
function GroupStackSetup() {
  return (
    <GroupStack.Navigator headerMode='none'>
      <GroupStack.Screen name='Groups' component={GroupsScreen} />
      <GroupStack.Screen name='GroupDetails' component={GroupTabsSetup} />
    </GroupStack.Navigator>
  );
}
function AccountStackSetup() {
  return (
    <GroupStack.Navigator headerMode='none'>
      <GroupStack.Screen name='SignIn' component={SignInScreen} />
      <GroupStack.Screen name='SignUp' component={SignUpScreen} />
      <GroupStack.Screen
        name='ForgotPassword'
        component={ForgotPasswordScreen}
      />
    </GroupStack.Navigator>
  );
}

function MainNavigatorSetup() {
  return (
    <NavigationContainer>
      <MainNavigator.Navigator headerMode='none'>
        <MainNavigator.Screen
          name='AccountStack'
          component={AccountStackSetup}
        />
        <MainNavigator.Screen name='Groups' component={GroupStackSetup} />
      </MainNavigator.Navigator>
    </NavigationContainer>
  );
}

// const groupBottomNavigator = createBottomTabNavigator({
//   Operations: OperationsScreen,
//   Balance: BalanceScreen,
// });
// const groupNavigator = createStackNavigator(
//   {
//     GroupTabs: groupBottomNavigator,
//     Groups: GroupsScreen,
//   },
//   { headerMode: "none" }
// );
// const accountNavigator = createStackNavigator(
//   {
//     SignIn: SignInScreen,
//     SignUp: SignUpScreen,
//     ForgotPassword: ForgotPasswordScreen,
//   },
//   { headerMode: "none" }
// );
// const mainNavigator = createStackNavigator({
//   Account: accountNavigator,
//   Groups: groupNavigator,
// });
MainNavigatorSetup();
export default MainNavigatorSetup();
