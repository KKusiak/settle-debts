import React, { useState, useEffect, createContext } from "react";
import firebase from "firebase";
import { localized, init } from "../lozalization/localized";
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
import OperationEditScreen from "../screens/OperationEditScreen";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { TouchableOpacity } from "react-native";
import GroupEditScreen from "../screens/GroupEditScreen";
import NewOperationScreen from "../screens/NewOperationScreen";
import CreateGroupScreen from "../screens/CreateGroupScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import SettingsScreen from "../screens/SettingsScreen";
export const AuthContext = createContext({});

const GroupStack = createStackNavigator();
const GroupTabs = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const MainNavigator = createStackNavigator();
const OperationStack = createStackNavigator();
const Drawer = createDrawerNavigator();
function OperationStackSetup() {
  return (
    <OperationStack.Navigator>
      <OperationStack.Screen
        name='GroupOperations'
        component={OperationsScreen}
      />
      <OperationStack.Screen
        name='OperationDetails'
        component={OperationDetailsScreen}
      />
      <OperationStack.Screen
        name='NewOperation'
        component={NewOperationScreen}
      />
      <OperationStack.Screen
        name='EditOperation'
        component={OperationEditScreen}
      />
    </OperationStack.Navigator>
  );
}
function GroupTabsSetup() {
  init();
  return (
    <GroupTabs.Navigator
      tabBarOptions={{
        activeTintColor: Colors.primary,
        inactiveTintColor: Colors.gray,
      }}
      backBehavior='none'>
      <GroupTabs.Screen
        name='Operations'
        component={OperationStackSetup}
        options={{
          title: localized("Operations"),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name='receipt' size={24} color={color} />
          ),
        }}
      />
      <GroupTabs.Screen
        name='Balance'
        component={BalanceScreen}
        options={{
          title: localized("Balance"),
          tabBarIcon: ({ color }) => (
            <FontAwesome name='dollar' size={24} color={color} />
          ),
        }}
      />
    </GroupTabs.Navigator>
  );
}
function GroupStackSetup() {
  init();
  return (
    <GroupStack.Navigator initialRouteName='GroupsList'>
      <GroupStack.Screen
        name='GroupsList'
        component={GroupsScreen}
        options={{ headerShown: false }}
      />
      <GroupStack.Screen
        name='NewGroup'
        component={CreateGroupScreen}
        options={{ title: localized("Create new group") }}
      />

      <GroupStack.Screen
        name='GroupTabs'
        component={GroupTabsSetup}
        options={{ headerShown: false }}
      />
      <GroupStack.Screen name='GroupEdit' component={GroupEditScreen} />
    </GroupStack.Navigator>
  );
}
function AuthStackSetup() {
  return (
    <AuthStack.Navigator headerMode='none'>
      <AuthStack.Screen name='SignIn' component={SignInScreen} />
      <AuthStack.Screen name='SignUp' component={SignUpScreen} />
      <AuthStack.Screen
        name='ForgotPassword'
        component={ForgotPasswordScreen}
      />
    </AuthStack.Navigator>
  );
}
const MainStackSetup = () => {
  return (
    <MainNavigator.Navigator headerMode='none'>
      <MainNavigator.Screen name='Groups' component={GroupStackSetup} />
    </MainNavigator.Navigator>
  );
};
export default function MainNavigatorSetup() {
  init();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  function onAuthStateChanged(result) {
    setUser(result);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const authSubscriber = firebase
      .auth()
      .onAuthStateChanged(onAuthStateChanged);

    // unsubscribe on unmount
    return authSubscriber;
  }, []);

  if (initializing) {
    return null;
  }

  return user ? (
    <NavigationContainer>
      <AuthContext.Provider value={user}>
        <Drawer.Navigator
          initialRouteName='Home'
          drawerContentOptions={{ activeTintColor: Colors.primary }}>
          <Drawer.Screen
            name='Home'
            component={MainStackSetup}
            options={{ title: localized("Home") }}
          />
          <Drawer.Screen
            name='Settings'
            component={SettingsScreen}
            options={{ title: localized("Settings") }}
          />
        </Drawer.Navigator>
      </AuthContext.Provider>
    </NavigationContainer>
  ) : (
    <NavigationContainer>
      <AuthStackSetup />
    </NavigationContainer>
  );
}
