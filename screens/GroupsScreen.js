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
    let updatedItem = { ...data };
    updatedItem.selected = !updatedItem.selected;
    const updatedGroup = groupsList;
    updatedGroup[index] = updatedItem;

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
  return (
    <View style={styles.screen}>
      <View>
        <FlatList
          data={groupsList}
          renderItem={(itemData) => renderListItem(itemData, itemData.index)}
          keyExtractor={(itemData) => itemData.title}
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={toggleVisible}>
        <AntDesign name='plus' color='white' size={27} />
      </TouchableOpacity>
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
        />
      </Overlay>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 50, paddingTop: 75 },
  addButton: {
    position: "absolute",
    bottom: "10%",
    right: "20%",
    borderRadius: 50,
    width: 60,
    height: 60,
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
  selectedGroup: {
    backgroundColor: "red",
  },
});

export default GroupScreen;
