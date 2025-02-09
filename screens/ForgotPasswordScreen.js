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
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import { ScrollView } from "react-native-gesture-handler";
import Input from "../components/Input";
import firebase from "firebase";
const ForgotPasswordScreen = (props) => {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  return (
    <ScrollView>
      <View style={styles.screen}>
        <View style={styles.container}>
          <Text>{localized("RememberPassword")}</Text>
          <CustomButton
            onPress={() => props.navigation.navigate("SignIn")}
            text={localized("signIn")}
            textStyle={styles.signInText}
            buttonStyle={{ marginLeft: 10 }}
          />
        </View>
        <Input
          leftIcon={
            <MaterialIcons name='mail-outline' size={30} color={Colors.gray} />
          }
          placeholder='Email'
          keyboardType='email-address'
          inputValue={enteredEmail}
          onChangeText={setEnteredEmail}
          validatingFunction={validateEmail}
        />
        <CustomButton
          buttonStyle={styles.sendLinkButton}
          text={localized("SendNewPassword")}
          textStyle={styles.sendLinkButtonText}
          onPress={() => {
            firebase
              .auth()
              .sendPasswordResetEmail(enteredEmail)
              .then(() => {
                props.navigation.navigate("SignIn");
              })
              .catch((error) => {
                alert(error.message);
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
  container: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 40,
  },
  signInText: {
    fontSize: 27,
    fontWeight: "bold",
    color: Colors.primary,
  },

  textInput: {
    width: "100%",
    marginLeft: 15,
    paddingBottom: 10,
  },
  forgotPasswordButton: {
    marginTop: 10,
  },
  sendLinkButton: {
    width: "100%",
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    paddingVertical: 12,
    marginTop: "10%",
  },
  sendLinkButtonText: {
    color: "#FFF",
    fontSize: 22,
  },
});
export default ForgotPasswordScreen;
