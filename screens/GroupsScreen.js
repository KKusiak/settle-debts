import React, { useState, Fragment, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
} from "react-native";

import { FlatList } from "react-native-gesture-handler";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import firebase from "firebase";
import { getGroups } from "../store/actions/groups";
const GroupScreen = (props) => {
  const dispatch = useDispatch();
  const groupsList = useSelector((state) => state.groups.groups);
  console.log("Rendering");
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
          }}>
          <Text style={styles.title}>{itemData.item.title}</Text>
          <Text style={styles.description}>{itemData.item.description}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={groupsList.length === 0 ? styles.emptyListScreen : styles.screen}>
      {groupsList.length === 0 ? (
        <Text style={styles.emptyListMessage}>
          You don't have a group, create your first with the button below
        </Text>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={groupsList}
            renderItem={(itemData) => renderListItem(itemData, itemData.index)}
            keyExtractor={(itemData) => itemData.title}
          />
        </View>
      )}

      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            navigation.navigate("NewGroup");
          }}>
          <AntDesign name='plus' color='white' size={27} />
        </TouchableOpacity>
      </View>
      <Button
        title='Sign out'
        onPress={() => {
          firebase.auth().signOut();
        }}
      />
      <Button
        title='Get'
        onPress={() => {
          dispatch(getGroups());
        }}
      />
    </View>

    // <ScrollView
    //   contentContainerStyle={
    //     groupsList.length === 0 ? styles.emptyListScreen : styles.screen
    //   }
    //   refreshControl={
    //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    //   }>

    // </ScrollView>
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
