import React, { useEffect, useLayoutEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import Operation from "../../components/Operation";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  createOperation,
  deleteOperation,
  updateOperation,
} from "../../store/actions/operations";
import { compose } from "redux";
const OperationsScreen = (props) => {
  const { navigation } = props;

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const tabNavigatorState = props.navigation
    .dangerouslyGetParent()
    .dangerouslyGetState();
  const groupId = tabNavigatorState.routes.find(
    (route) => route.name === "Operations"
  ).params.groupId;

  const group = useSelector((state) => state.groups.groups).find(
    (group) => group.id === groupId
  );

  const operations = useSelector((state) => state.operations.operations).filter(
    (operation) => operation.groupId === groupId
  );

  const longPressHandler = (operation) => {
    dispatch(deleteOperation(operation.id));
  };

  // effect updating header title if necessary
  useEffect(() => {
    props.navigation.setOptions({
      title: group.title,
    });
  }, [navigation, group, isFocused]);

  // setting up header button
  props.navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate("GroupEdit", { groupId: group.id })}>
        <MaterialIcons name='edit' color='black' size={24} />
      </TouchableOpacity>
    ),
    headerRightContainerStyle: { marginHorizontal: 20 },
  });

  return (
    <View style={styles.screen}>
      <View style={{ flex: 1, marginBottom: 20 }}>
        <FlatList
          data={operations}
          keyExtractor={(item) => item.operationId.toString()}
          renderItem={(itemData) => {
            return (
              <Operation
                operation={itemData.item}
                group={group}
                navigation={props.navigation}
                onLongPress={longPressHandler}
              />
            );
          }}
        />
      </View>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            navigation.navigate("NewOperation", { groupId: group.id });
          }}>
          <AntDesign name='plus' color='white' size={27} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1, padding: 40, paddingBottom: 0 },
  addButton: {
    borderRadius: 50,
    width: 60,
    height: 60,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default OperationsScreen;
