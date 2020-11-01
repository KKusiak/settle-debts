import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { localized, init } from "../lozalization/localized";
import firebase from "firebase";
const SettingsScreen = (props) => {
  init();
  return (
    <View style={styles.screen}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          firebase.auth().signOut();
        }}>
        <Text style={styles.buttonText}>{localized("SignOut")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={{ ...styles.buttonText, color: "red" }}>
          {localized("DeleteAccount")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
  },
  button: {
    marginVertical: 15,
  },
});
export default SettingsScreen;
