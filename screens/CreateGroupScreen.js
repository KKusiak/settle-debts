import React, { useState, Fragment } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import Input from "../components/Input";
import { useDispatch } from "react-redux";
import { createGroup } from "../store/actions/groups";
import firebase from "firebase";
const CreateGroupScreen = (props) => {
  const dispatch = useDispatch();
  const { navigation } = props;
  const [memberName, setMemberName] = useState("");
  const [group, setGroup] = useState({
    title: "",
    description: "",
    members: [
      {
        id: firebase.auth().currentUser.uid,
        name: firebase.auth().currentUser.displayName,
        balance: 0,
      },
    ],
  });
  const onAddMember = () => {
    const member = {
      id: Math.floor(Math.random() * 100000 + 1),
      name: memberName,
      balance: 0,
    };
    const updatedGroup = { ...group };
    updatedGroup.members.push(member);
    setGroup(updatedGroup);
  };
  const onDeleteMember = (index) => {
    if (group.members[index].id !== firebase.auth().currentUser.uid) {
      const updatedGroup = { ...group };
      updatedGroup.members.splice(index, 1);
      setGroup(updatedGroup);
    } else {
      alert("You can't remove yourself from the group");
    }
  };
  const onCreateGroup = () => {
    const readyGroup = { ...group };
    navigation.navigate("GroupsList");
    dispatch(createGroup(readyGroup));
  };
  const renderMemberItem = (itemData) => {
    return (
      <View style={styles.memberItemContainer}>
        <Text style={{ flex: 1 }}>{itemData.item.name}</Text>
        <TouchableOpacity
          style={styles.memberItemDeleteButton}
          onPress={() => {
            onDeleteMember(itemData.index);
          }}>
          <MaterialIcons name='delete' size={25} color='#ff3d00' />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.screen}>
      <View style={{ flex: 1 }}>
        <Input
          leftIcon={
            <MaterialIcons name='title' size={30} color={Colors.gray} />
          }
          placeholder='Title'
          inputValue={group.title}
          onChangeText={(newText) => {
            const updatedGroup = { ...group, title: newText };
            setGroup(updatedGroup);
          }}
        />
        <Input
          leftIcon={
            <MaterialIcons name='description' size={30} color={Colors.gray} />
          }
          placeholder='Description'
          inputValue={group.description}
          onChangeText={(newText) => {
            const updatedGroup = { ...group, description: newText };
            setGroup(updatedGroup);
          }}
        />

        <View style={styles.membersContainer}>
          <Text>Members</Text>
          <View style={styles.membersListContainer}>
            {group.members.length === 0 ? (
              <Text style={styles.emptyMembers}>Add your friends to list</Text>
            ) : (
              <FlatList
                data={group.members}
                keyExtractor={(item) => item.id.toString()}
                renderItem={(itemData) => renderMemberItem(itemData)}
                persistentScrollbar={true}
              />
            )}
          </View>
          <View style={styles.addMemberContainer}>
            <Input
              placeholder='Name'
              leftIcon={
                <MaterialIcons
                  name='person-outline'
                  size={30}
                  color={Colors.gray}
                />
              }
              inputValue={memberName}
              onChangeText={(newText) => {
                setMemberName(newText);
              }}
              onSubmitEditing={() => {
                onAddMember();
                setMemberName("");
              }}
            />
            <TouchableOpacity
              onPress={() => {
                onAddMember();
                setMemberName("");
              }}
              style={styles.addMemberButton}>
              <Text>Add member</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          onCreateGroup();
        }}
        style={styles.createButton}>
        <Text style={{ color: Colors.primary, fontSize: 20 }}>CREATE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, margin: 20 },
  memberItemContainer: { flexDirection: "row" },
  memberItemDeleteButton: {},
  membersListContainer: { marginTop: 20 },
  addMemberContainer: { marginVertical: 20 },
  addMemberButton: { alignSelf: "flex-end", marginTop: 10 },
  membersContainer: {
    marginTop: 20,
  },
  createButton: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
});
export default CreateGroupScreen;
