import React, { useEffect, useLayoutEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  RefreshControl,
} from "react-native";
import Operation from "../../components/Operation";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { deleteOperation, getOperations } from "../../store/actions/operations";
import { init, localized } from "../../lozalization/localized";
const OperationsScreen = (props) => {
  init();
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
    (operation) => operation !== undefined && operation.groupId === groupId
  );

  const longPressHandler = (operation) => {
    dispatch(deleteOperation(operation.id));
  };
  // swipe down to refresh functionality
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(getOperations(groupId))
      .then(() => {
        setRefreshing(false);
      })
      .catch((error) => {
        setRefreshing(false);
        console.log(error);
      });
  }, []);
  useEffect(() => {
    onRefresh();
  }, []);
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
    <FlatList
      data={operations}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => {
        return (
          <Operation
            listKey={itemData.item.id}
            operation={itemData.item}
            group={group}
            navigation={props.navigation}
            onLongPress={longPressHandler}
          />
        );
      }}
      ListEmptyComponent={
        <View
          style={{
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "center",
          }}>
          <Text style={styles.emptyListMessage}>
            {localized("Add your first operation")}
          </Text>
        </View>
      }
      ListFooterComponent={
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            navigation.navigate("NewOperation", { groupId: group.id });
          }}>
          <AntDesign name='plus' color='white' size={27} />
        </TouchableOpacity>
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListFooterComponentStyle={{
        flexGrow: operations.length === 0 ? 0 : 1,
        justifyContent: "flex-end",
        alignItems: "center",
      }}
      contentContainerStyle={{ flexGrow: 1, margin: 50 }}
    />
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
  emptyListMessage: {
    fontSize: 16,
    textAlign: "center",
  },
});
export default OperationsScreen;
