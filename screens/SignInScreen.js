import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

import Colors from "../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
const SignInScreen = (props) => {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  return (
    <View style={styles.screen}>
      <View style={styles.signUpButton}>
        <Text>Don't have account yet?</Text>
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => props.navigation.navigate("SignUp")}>
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.field}>
        <MaterialIcons name='mail-outline' size={30} color={Colors.gray} />
        <TextInput
          style={styles.textInput}
          placeholder='Email'
          placeholderTextColor={Colors.gray}
        />
      </View>
      <View style={styles.field}>
        <MaterialIcons name='lock-outline' size={30} color={Colors.gray} />
        <TextInput
          style={styles.textInput}
          placeholder='Password'
          placeholderTextColor={Colors.gray}
          secureTextEntry={true}
        />
      </View>

      <TouchableOpacity
        style={styles.forgotPasswordButton}
        onPress={() => props.navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgotPasswordButtonText}>
          I forgot my password
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logInButton}>
        <View>
          <Text style={styles.logInText}>Log in</Text>
        </View>
      </TouchableOpacity>
    </View>
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
  signUpButton: {
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
  field: {
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
