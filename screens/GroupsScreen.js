import React, { useState, Fragment, useEffect } from "react";
import {
  View,
  Button,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Overlay } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import CreateGroupOverlay from "../components/CreateGroupOverlay";
import Input from "../components/Input";
const GroupScreen = (props) => {
  const [refresh, toggleRefresh] = useState(false);
  const [groupsList, setGroupsList] = useState([
    {
      title: "TESt",
      description: "test",
      members: [],
      selected: false,
    },
  ]);
  const [newGroup, setNewGroup] = useState({
    title: "",
    description: "",
    members: [],
  });
  const [memberName, setMemberName] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisible = () => {
    setIsVisible(!isVisible);
  };
  const onSelect = (data, index) => {
    // let updatedItem = { ...data };
    // updatedItem.selected = !updatedItem.selected;
    // const updatedGroup = groupsList;
    // updatedGroup[index] = updatedItem;

    const updatedGroup = groupsList.filter((item) => item.title !== data.title);

    setGroupsList([...updatedGroup]);
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
            onSelect(itemData.item, index);
          }}
          onPress={() => {
            props.navigation.navigate("GroupDetails");
          }}>
          <Text style={styles.title}>{itemData.item.title}</Text>
          <Text style={styles.description}>{itemData.item.description}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const onAddToList = () => {
    setGroupsList((list) => [...list, newGroup]);
    setIsVisible(!isVisible);
    setNewGroup({ title: "", description: "", members: [] });
  };
  const onAddMember = () => {
    const updatedMembers = [...newGroup.members, memberName];
    setNewGroup((group) => ({ ...group, members: updatedMembers }));
    setMemberName("");
  };
  const onDeleteMember = (index) => {
    const updatedMembers = newGroup.members.filter(
      (value, itemIndex) => itemIndex !== index
    );
    setNewGroup((group) => ({ ...group, members: updatedMembers }));
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
        <TouchableOpacity style={styles.addButton} onPress={toggleVisible}>
          <AntDesign name='plus' color='white' size={27} />
        </TouchableOpacity>
      </View>
      <Overlay
        isVisible={isVisible}
        onBackdropPress={() => {
          toggleVisible(),
            setNewGroup({ title: "", description: "", members: [] });
          setMemberName("");
        }}
        fullScreen={true}
        animated={true}
        animationType='fade'>
        <CreateGroupOverlay
          newGroup={newGroup}
          setNewGroup={setNewGroup}
          memberName={memberName}
          setMemberName={setMemberName}
          onAddMember={onAddMember}
          onAddToList={onAddToList}
          onDeleteMember={onDeleteMember}
        />
      </Overlay>
    </View>
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
});

export default GroupScreen;
