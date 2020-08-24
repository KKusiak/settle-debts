import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const CustomButton = (props) => {
  const onPress = props.onPress ? props.onPress : () => {};
  return (
    <TouchableOpacity style={props.buttonStyle} onPress={onPress}>
      <View>
        <Text style={props.textStyle}>{props.text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
