import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";

const accountNavigator = createStackNavigator(
  {
    SignIn: SignInScreen,
    SignUp: SignUpScreen,
    ForgotPassword: ForgotPasswordScreen,
  },
  { headerMode: "none" }
);

export default createAppContainer(accountNavigator);
