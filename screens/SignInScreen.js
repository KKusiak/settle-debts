import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { localized, init } from "../lozalization/localized";
import Colors from "../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import { ScrollView } from "react-native-gesture-handler";
import Input from "../components/Input";
import firebase from "firebase";
import { useDispatch } from "react-redux";
import { getGroups } from "../store/actions/groups";
const SignInScreen = (props) => {
  init();
  const dispatch = useDispatch();
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValidated, setIsPasswordValidated] = useState(false);
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  return (
    <ScrollView>
      <View style={styles.screen}>
        <View style={styles.signUpContainer}>
          <Text>{localized("accountNotCreatedQuestion")}</Text>
          <CustomButton
            onPress={() => props.navigation.navigate("SignUp")}
            text={localized("signUp")}
            textStyle={styles.signUpText}
            buttonStyle={{ marginLeft: 10 }}
          />
        </View>
        <Input
          leftIcon={
            <MaterialIcons name='mail-outline' size={30} color={Colors.gray} />
          }
          placeholder='Email'
          inputValue={enteredEmail}
          onChangeText={(newText) => {
            setEnteredEmail(newText);
            setIsEmailValid(validateEmail(newText));
          }}
          validatingFunction={validateEmail}
          keyboardType='email-address'
        />
        <Input
          placeholder={localized("Password")}
          inputValue={enteredPassword}
          onChangeText={(newText) => setEnteredPassword(newText)}
          validatingFunction={() => {
            if (enteredPassword.length > 0) {
              return true;
            } else return false;
          }}
          leftIcon={
            <MaterialIcons name='lock-outline' size={30} color={Colors.gray} />
          }
          secureTextEntry={true}
        />
        <CustomButton
          buttonStyle={styles.forgotPasswordButton}
          onPress={() => props.navigation.navigate("ForgotPassword")}
          text={localized("forgotPassword")}
          textStyle={styles.forgotPasswordButtonText}
        />
        <CustomButton
          buttonStyle={styles.logInButton}
          text={localized("signIn")}
          textStyle={styles.logInText}
          onPress={() => {
            firebase
              .auth()
              .signInWithEmailAndPassword(enteredEmail, enteredPassword)
              .then(() => {
                dispatch(getGroups());
              })
              .catch((error) => {
                const errorMessage = error.message;
                console.error;
              });
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 35,
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  signUpContainer: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 15,
  },
  signUpText: {
    fontSize: 27,
    fontWeight: "bold",
    color: Colors.primary,
  },

  forgotPasswordButton: {
    marginTop: 10,
  },
  logInButton: {
    width: "100%",
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    paddingVertical: 12,
    marginTop: "30%",
  },
  logInText: {
    color: "#FFF",
    fontSize: 22,
  },
});

export default SignInScreen;
