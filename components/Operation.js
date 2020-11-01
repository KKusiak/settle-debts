import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import Colors from "../constants/Colors";
import { init, localized } from "../lozalization/localized";
const Operation = (props) => {
  init();
  const operation = props.operation;

  const group = props.group;
  const payer = group.members.find((user) => user.id === operation.payer);

  const recipents = operation.recipents.map((recipent) =>
    group.members.find((user) => user.id === recipent)
  );

  return (
    <TouchableOpacity
      onLongPress={() => props.onLongPress(operation)}
      onPress={() => {
        props.navigation.navigate("OperationDetails", {
          id: operation.id,
          groupId: group.id,
        });
      }}>
      <View style={styles.container}>
        <View style={styles.leftColumn}>
          <Text style={styles.title}>{operation.title}</Text>
          <Text>
            {localized("Paid by")}{" "}
            <Text style={styles.payer}>{payer.name}</Text>
          </Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.value}>{operation.value.format()} </Text>
          <FlatList
            listKey={props.listKey}
            data={recipents}
            keyExtractor={(item) => item.id}
            renderItem={(itemData) => (
              <Text style={styles.recipent}>{itemData.item.name}</Text>
            )}
          />
        </View>
      </View>
    </TouchableOpacity>
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
  recipent: { fontWeight: "bold" },
});
export default Operation;
