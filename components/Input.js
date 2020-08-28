import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
const Input = (props) => {
  const [isErrored, setIsErrored] = useState(true);
  const [inputStyle, setInputStyle] = useState(styles.unValidatedField);
  const renderError = () => {
    if (isErrored) {
      return <Text style={styles.errorMessage}>{props.errorMessage}</Text>;
    }
  };
  const validateInput = props.validatingFunction
    ? props.validatingFunction
    : (text) => {
        if (text.length > 0) {
          return true;
        } else return false;
      };
  const { disabled, inputValue } = props;
  useEffect(() => {
    if (disabled === undefined || disabled === false) {
      if (validateInput(inputValue)) {
        setIsErrored(false);
        setInputStyle(styles.validatedField);
      } else {
        setIsErrored(true);
        setInputStyle(styles.unValidatedField);
      }
    } else if (disabled === true) {
      setIsErrored(false);
      setInputStyle(styles.disabledInput);
    }
  }, [inputValue, disabled]);

  return (
    <View style={styles.inputContainerStyle}>
      {props.header ? <Text style={styles.header}>{props.header}</Text> : null}
      <View style={inputStyle}>
        {props.leftIcon ? props.leftIcon : null}
        <TextInput
          placeholder={props.placeholder}
          value={props.inputValue}
          onChangeText={(newText) => {
            props.onChangeText(newText);
          }}
          style={{ width: "100%", marginLeft: 10 }}
          editable={!disabled}
          secureTextEntry={props.secureTextEntry}
          keyboardType={props.keyboardType}
        />
        {props.rightIcon ? props.rightIcon : null}
      </View>
      {props.renderError ? renderError() : null}
    </View>
  );
};

const styles = StyleSheet.create({
  errorMessage: { color: "red", fontSize: 12 },
  header: { fontSize: 16 },
  validatedField: {
    marginHorizontal: 10,
    marginVertical: 15,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: Colors.primary,
    borderBottomWidth: 1,
  },
  unValidatedField: {
    marginHorizontal: 10,
    marginVertical: 15,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: Colors.accent,
    borderBottomWidth: 1,
  },
  disabledInput: {
    marginHorizontal: 10,
    marginVertical: 15,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1,
  },
});

export default Input;
