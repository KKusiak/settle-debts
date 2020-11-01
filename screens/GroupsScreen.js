import React, {
  useState,
  Fragment,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  View,
  Text,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
  Alert,
} from "react-native";

import { FlatList } from "react-native-gesture-handler";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import firebase from "firebase";
import { getGroups } from "../store/actions/groups";
import { getOperations } from "../store/actions/operations";
import { init, localized } from "../lozalization/localized";
const GroupScreen = (props) => {
  init();
  const dispatch = useDispatch();
  const groupsList = useSelector((state) => state.groups.groups);

  const { navigation } = props;
  // swipe down to refresh functionality
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(getGroups())
      .then(() => {
        setRefreshing(false);
      })
      .catch((error) => {
        setRefreshing(false);
        console.log(error);
      });
  }, []);

  //
  useEffect(() => {
    navigation.setOptions({ headerMode: "none" });
  }, [navigation]);

  // useEffect(() => {
  //   let unsubscribe = () => {};
  //   dispatch(getGroups()).then((fun) => {
  //     unsubscribe = fun;
  //   });
  //   return () => {
  //     console.log("GroupsScreen unsubscribe");
  //     unsubscribe();
  //   };
  // }, []);

  const onSelect = (data) => {
    dispatch(deleteGroup(data.id));
  };

  const renderListItem = (itemData, index) => {
    return (
      <View
        style={
          itemData.item.selected
            ? styles.selectedGroup
            : styles.listItemContainer
        }>
        <TouchableOpacity
          onLongPress={() => {
            onSelect(itemData.item);
          }}
          onPress={() => {
            props.navigation.navigate("GroupTabs", {
              screen: "Operations",
              params: { groupId: itemData.item.id },
            });
            dispatch(getOperations(itemData.item.id));
          }}>
          <Text style={styles.title}>{itemData.item.title}</Text>
          <Text style={styles.description}>{itemData.item.description}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={groupsList}
      ListEmptyComponent={
        <View
          style={{
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "center",
          }}>
          <Text style={styles.emptyListMessage}>
            {localized(
              "You don't have a group, create your first with the button below"
            )}
          </Text>
        </View>
      }
      renderItem={(itemData) => renderListItem(itemData, itemData.index)}
      keyExtractor={(itemData) => itemData.id}
      ListFooterComponent={
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            navigation.navigate("NewGroup");
          }}>
          <AntDesign name='plus' color='white' size={27} />
        </TouchableOpacity>
      }
      ListFooterComponentStyle={{
        flexGrow: groupsList.length === 0 ? 0 : 1,
        justifyContent: "flex-end",
        alignItems: "center",
      }}
      contentContainerStyle={{ flexGrow: 1, margin: 50 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />

    // <View>
    //     {groupsList.length === 0 ? (
    //       <Text style={styles.emptyListMessage}>
    //         You don't have a group, create your first with the button below
    //       </Text>
    //     ) : (
    //       <View style={{ flex: 1 }}>
    //         <FlatList
    //           data={groupsList}
    //           renderItem={(itemData) =>
    //             renderListItem(itemData, itemData.index)
    //           }
    //           keyExtractor={(itemData) => itemData.id}
    //         />
    //       </View>
    //     )}

    //     <View style={{ alignItems: "center" }}>
    //       <TouchableOpacity
    //         style={styles.addButton}
    //         onPress={() => {
    //           navigation.navigate("NewGroup");
    //         }}>
    //         <AntDesign name='plus' color='white' size={27} />
    //       </TouchableOpacity>
    //     </View>
    //     <Button
    //       title='Sign out'
    //       onPress={() => {
    //         firebase.auth().signOut();
    //       }}
    //     />
    //   </View>
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 50, paddingTop: 75 },
  emptyListScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 50,
    paddingTop: 75,
  },
  addButton: {
    borderRadius: 50,
    width: 60,
    height: 60,
    marginBottom: 45,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  listItemContainer: {
    width: "100%",
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1,
    marginVertical: 10,
    paddingBottom: 10,
  },
  overlayStyle: { width: "70%", paddingVertical: 20 },
  button: {
    backgroundColor: Colors.primary,
    height: 30,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    width: "100%",
    marginLeft: 15,
    paddingBottom: 5,
  },
  emptyListMessage: {
    fontSize: 16,
    textAlign: "center",
  },
  title: { fontSize: 20 },
});

export default GroupScreen;
