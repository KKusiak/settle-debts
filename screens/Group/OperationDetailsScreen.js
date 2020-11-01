import React, { useEffect, useLayoutEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Colors";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import { init, localized } from "../../lozalization/localized";
const OperationDetailsScreen = (props) => {
  init();
  const { navigation } = props;
  const { operationId, groupId } = props.route.params;
  const isFocused = useIsFocused();

  const operation = useSelector((state) => state.operations.operations).find(
    (obj) => obj.operationId === operationId
  );
  const group = useSelector((state) => state.groups.groups).find(
    (obj) => obj.id === groupId
  );

  const payer = group.members.find((user) => user.id === operation.payer);
  const recipents = operation.recipents.map((recipent) =>
    group.members.find((user) => user.id === recipent)
  );

  useLayoutEffect(() => {
    props.navigation.setOptions(
      {
        title: operation.title,
        headerRight: () => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EditOperation", {
                operationId: operation.operationId,
                groupId: group.id,
              })
            }>
            <MaterialIcons name='edit' color='black' size={24} />
          </TouchableOpacity>
        ),
        headerRightContainerStyle: { marginHorizontal: 20 },
      },
      [navigation]
    );
  });

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{operation.value.format()} </Text>

      <Text style={styles.payerParagraph}>
        {localized("Paid by")} <Text style={styles.payer}>{payer.name}</Text>{" "}
        {localized("for")}
      </Text>
      <FlatList
        style={styles.box}
        data={recipents}
        renderItem={(recipent) => (
          <View style={styles.recipentContainer}>
            <Text style={styles.recipentName}>{recipent.item.name}</Text>

            <Text style={styles.recipent}>
              {operation.value.divide(operation.recipents.length).format()}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, margin: 20 },
  title: {
    fontSize: 36,
    textAlign: "center",
    fontWeight: "bold",
    color: Colors.primary,
    marginVertical: 30,
  },

  payerParagraph: { fontSize: 16, marginVertical: 15 },
  payer: { fontWeight: "bold" },
  recipent: {
    fontSize: 16,
  },
  recipentName: {
    fontSize: 16,
    flex: 1,
  },
  recipentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
export default OperationDetailsScreen;
