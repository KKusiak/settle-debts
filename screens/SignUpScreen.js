import React, { useState, useEffect } from "react";
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
const SignUpScreen = (props) => {
  init();
  const [enteredName, setEnteredName] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredRetypedPassword, setEnteredRetypedPassword] = useState("");
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  return (
    <ScrollView>
      <View style={styles.screen}>
        <View style={styles.signInContainer}>
          <Text>{localized("haveAccount?")}</Text>
          <CustomButton
            onPress={() => props.navigation.navigate("SignIn")}
            text={localized("signIn")}
            textStyle={styles.signInText}
            buttonStyle={{ marginLeft: 10 }}
          />
        </View>
        <Input
          leftIcon={
            <MaterialIcons
              name='person-outline'
              size={30}
              color={Colors.gray}
            />
          }
          placeholder={localized("Name")}
          inputValue={enteredName}
          onChangeText={setEnteredName}
        />
        <Input
          leftIcon={
            <MaterialIcons name='mail-outline' size={30} color={Colors.gray} />
          }
          placeholder='Email'
          keyboardType='email-address'
          inputValue={enteredEmail}
          onChangeText={setEnteredEmail}
          validatingFunction={validateEmail}
          errorMessage={localized("ProvideValidEmail")}
          renderError={true}
        />
        <Input
          leftIcon={
            <MaterialIcons name='lock-outline' size={30} color={Colors.gray} />
          }
          placeholder={localized("Password")}
          secureTextEntry={true}
          inputValue={enteredPassword}
          onChangeText={setEnteredPassword}
          validatingFunction={() => {
            if (enteredPassword.length >= 8) return true;
            else return false;
          }}
          errorMessage={localized("ProvideValidPassword")}
          renderError={true}
        />
        <Input
          leftIcon={
            <MaterialIcons name='lock-outline' size={30} color={Colors.gray} />
          }
          placeholder={localized("RetypePassword")}
          secureTextEntry={true}
          inputValue={enteredRetypedPassword}
          onChangeText={setEnteredRetypedPassword}
          validatingFunction={() => {
            if (
              enteredPassword === enteredRetypedPassword &&
              enteredPassword.length > 0
            ) {
              return true;
            } else {
              return false;
            }
          }}
          disabled={!enteredPassword}
          errorMessage={localized("PasswordsDontMatch")}
          renderError={true}
        />
        <CustomButton
          buttonStyle={styles.signUpButton}
          text={localized("signUp")}
          textStyle={styles.signUpText}
          onPress={() => {
            firebase
              .auth()
              .createUserWithEmailAndPassword(
                enteredEmail.toLowerCase(),
                enteredPassword
              )
              .then((UserCredential) => {
                firebase
                  .firestore()
                  .doc(`RegisteredUsers/${UserCredential.user.uid}`)
                  .set({
                    name: enteredName,
                    email: enteredEmail.toLowerCase(),
                  });
                firebase
                  .auth()
                  .currentUser.updateProfile({ displayName: enteredName })
                  .catch((error) => console.log(error));
                firebase.auth().useDeviceLanguage();
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode == "auth/weak-password") {
                  alert("The password is too weak.");
                } else {
                  alert(errorMessage);
                }
              });
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    height: "100%",
    padding: 35,
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  signInContainer: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 15,
  },
  signInText: {
    fontSize: 27,
    fontWeight: "bold",
    color: Colors.primary,
  },
  forgotPasswordButton: {
    marginTop: 10,
  },
  signUpButton: {
    width: "100%",
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    paddingVertical: 12,
    marginTop: "30%",
  },
  signUpText: {
    color: "#FFF",
    fontSize: 22,
  },
});

export default SignUpScreen;
