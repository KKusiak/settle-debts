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
import CustomButton from "../components/CustomButton";
import { ScrollView } from "react-native-gesture-handler";

const ForgotPasswordScreen = (props) => {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  return (
    <ScrollView>
      <View style={styles.screen}>
        <View style={styles.container}>
          <Text>Remember password?</Text>
          <CustomButton
            onPress={() => props.navigation.navigate("SignIn")}
            text='Sign in'
            textStyle={styles.signInText}
            buttonStyle={{ marginLeft: 10 }}
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
        <CustomButton
          buttonStyle={styles.sendLinkButton}
          text='Send reset link'
          textStyle={styles.sendLinkButtonText}
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
  validatedField: {
    marginHorizontal: 30,
    marginVertical: 20,
    flexDirection: "row",
    borderBottomColor: Colors.primary,
    borderBottomWidth: 1,
  },
  unValidatedField: {
    marginHorizontal: 30,
    marginVertical: 20,
    flexDirection: "row",
    borderBottomColor: Colors.accent,
    borderBottomWidth: 1,
  },
});
export default ForgotPasswordScreen;
