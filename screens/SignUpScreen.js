import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

import Colors from "../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import { ScrollView } from "react-native-gesture-handler";
const SignUpScreen = (props) => {
  const [enteredName, setEnteredName] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredRetypedPassword, setEnteredRetypedPassword] = useState("");
  const [isPasswordEntered, setIsPasswordEntered] = useState(false);
  const [passwordsMatch, setPasswordMatch] = useState(false);

  const [passwordFieldStyle, setPasswordFieldStyle] = useState(
    styles.unValidatedField
  );
  const [reTypePassFieldStyle, setReTypePassFieldStyle] = useState(
    styles.disabledInput
  );
  const [isEmailValid, setIsEmailValid] = useState(false);
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  useEffect(() => {
    if (isPasswordEntered) {
      setReTypePassFieldStyle(styles.unValidatedField);
    } else {
      setReTypePassFieldStyle(styles.disabledInput);
      setEnteredRetypedPassword("");
    }
    if (enteredPassword === enteredRetypedPassword && isPasswordEntered) {
      setPasswordFieldStyle(styles.validatedField);
      setReTypePassFieldStyle(styles.validatedField);
    } else setPasswordFieldStyle(styles.unValidatedField);
  }, [enteredPassword, enteredRetypedPassword]);
  return (
    <ScrollView>
      <View style={styles.screen}>
        <View style={styles.signInContainer}>
          <Text>Have account?</Text>
          <CustomButton
            onPress={() => props.navigation.navigate("SignIn")}
            text='Sign In'
            textStyle={styles.signInText}
            buttonStyle={{ marginLeft: 10 }}
          />
        </View>
        <View
          style={enteredName ? styles.validatedField : styles.unValidatedField}>
          <MaterialIcons name='person-outline' size={30} color={Colors.gray} />
          <TextInput
            style={styles.textInput}
            placeholder='Name'
            placeholderTextColor={Colors.gray}
            value={enteredName}
            onChangeText={(newText) => setEnteredName(newText)}
          />
        </View>
        <View
          style={
            isEmailValid ? styles.validatedField : styles.unValidatedField
          }>
          <MaterialIcons name='mail-outline' size={30} color={Colors.gray} />
          <TextInput
            style={styles.textInput}
            placeholder='Email'
            keyboardType='email-address'
            placeholderTextColor={Colors.gray}
            value={enteredEmail}
            onChangeText={(newText) => {
              setEnteredEmail(newText);
              setIsEmailValid(validateEmail(newText));
            }}
          />
        </View>
        <View style={passwordFieldStyle}>
          <MaterialIcons name='lock-outline' size={30} color={Colors.gray} />
          <TextInput
            style={styles.textInput}
            placeholder='Password'
            placeholderTextColor={Colors.gray}
            secureTextEntry={true}
            value={enteredPassword}
            onChangeText={(newText) => {
              if (newText.length > 0) {
                setIsPasswordEntered(true);
              } else {
                setIsPasswordEntered(false);
              }
              setEnteredPassword(newText);
            }}
          />
        </View>
        <View style={reTypePassFieldStyle}>
          <MaterialIcons name='lock-outline' size={30} color={Colors.gray} />
          <TextInput
            style={styles.textInput}
            placeholder='Retype password'
            placeholderTextColor={Colors.gray}
            secureTextEntry={true}
            editable={isPasswordEntered}
            value={enteredRetypedPassword}
            onChangeText={(newText) => {
              setEnteredRetypedPassword(newText);
            }}
          />
        </View>
        <CustomButton
          buttonStyle={styles.signUpButton}
          text='Sign up'
          textStyle={styles.signUpText}
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
  unValidatedField: {
    marginHorizontal: 30,
    marginVertical: 20,
    flexDirection: "row",
    borderBottomColor: Colors.accent,
    borderBottomWidth: 1,
  },
  textInput: {
    width: "100%",
    marginLeft: 15,
    paddingBottom: 10,
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
  disabledInput: {
    marginHorizontal: 30,
    marginVertical: 20,
    flexDirection: "row",
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1,
  },
  validatedField: {
    marginHorizontal: 30,
    marginVertical: 20,
    flexDirection: "row",
    borderBottomColor: Colors.primary,
    borderBottomWidth: 1,
  },
});

export default SignUpScreen;
