import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

import Colors from "../constants/Colors";

const SignInScreen = (props) => {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  return (
    <View style={styles.screen}>
      <Text style={styles.greetingsText}>TODO powitanie</Text>
      <View style={styles.fieldsContainer}>
        <TextInput
          style={styles.field}
          value={enteredEmail}
          placeholder="email"
          onChangeText={(text) => setEnteredEmail(text)}
        />
        <TextInput
          style={styles.field}
          value={enteredPassword}
          placeholder="password"
          secureTextEntry={true}
          onChangeText={(text) => setEnteredPassword(text)}
        />
      </View>
      <TouchableOpacity>
        <Text>LOG IN</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>I forgot my password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#d4d4d4",
  },
  greetingsText: {
    fontSize: 24,
    marginVertical: 40,
  },
  field: {
    fontSize: 18,
    marginVertical: 10,
    backgroundColor: "#e4e4e4",
    height: 36,
    borderBottomColor: Colors.accent_1,
    borderBottomWidth: 1,
  },
});

export default SignInScreen;
