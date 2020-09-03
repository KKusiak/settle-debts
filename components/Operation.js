import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
const Operation = (props) => {
  const operation = props.operation;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("OperationDetails");
        }}>
        <View style={styles.leftColumn}>
          <Text style={styles.title}>{operation.title}</Text>
          <Text>
            Payed by <Text style={styles.payer}>{operation.payer}</Text>
          </Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.value}>{operation.value.toFixed(2)} zł</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingBottom: 5,
  },
  leftColumn: {
    flex: 1,
  },
  title: { fontSize: 20 },
  payer: { fontWeight: "bold" },
  value: { fontWeight: "bold" },
});
export default Operation;
