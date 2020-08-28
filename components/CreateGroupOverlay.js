import React, { useState, Fragment } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import Input from "./Input";
const CreateGroupOverlay = (props) => {
  const [isMemberEmpty, setIsMembersEmpty] = useState(true);
  return (
    <Fragment>
      <View style={styles.screen}>
        <Text>Create new group</Text>
        <Input
          placeholder='Title'
          leftIcon={
            <MaterialIcons name='title' size={20} color={Colors.gray} />
          }
          inputValue={props.newGroup.title}
          onChangeText={(newText) => {
            props.setNewGroup((group) => {
              return { ...group, title: newText };
            });
          }}
        />
        <Input
          placeholder='Description'
          leftIcon={
            <MaterialIcons name='description' size={20} color={Colors.gray} />
          }
          inputValue={props.newGroup.description}
          onChangeText={(newText) => {
            props.setNewGroup((group) => {
              return { ...group, description: newText };
            });
          }}
        />
        <View style={styles.membersContainer}>
          <Text>Members</Text>
          {isMemberEmpty ? (
            <Text style={styles.emptyMembers}>Add your friends to list</Text>
          ) : (
            <FlatList
              data={props.newGroup.members}
              keyExtractor={(item) => item}
              renderItem={(itemData) => (
                <Text style={styles.member}>{itemData.item}</Text>
              )}
              style={styles.membersList}
              persistentScrollbar={true}
            />
          )}
          <Input
            placeholder='Name'
            leftIcon={
              <MaterialIcons
                name='person-outline'
                size={20}
                color={Colors.gray}
              />
            }
            inputValue={props.memberName}
            onChangeText={(newText) => {
              props.setMemberName(newText);
            }}
          />
          <TouchableOpacity
            onPress={() => {
              props.onAddMember();
              setIsMembersEmpty(false);
            }}
            style={styles.addMemberButton}>
            <Text>Add member</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={props.onAddToList}
          style={styles.createButton}>
          <Text style={{ color: "white" }}>CREATE</Text>
        </TouchableOpacity>
      </View>
    </Fragment>
  );
};
const styles = StyleSheet.create({
  overlayStyle: { width: "70%", paddingVertical: 20 },

  validatedField: {
    marginHorizontal: 10,
    marginVertical: 15,
    flexDirection: "row",
    borderBottomColor: Colors.primary,
    borderBottomWidth: 1,
  },
  unValidatedField: {
    marginHorizontal: 10,
    marginVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: Colors.accent,
    borderBottomWidth: 1,
  },
  textInput: {
    width: "100%",
    marginLeft: 15,
    paddingBottom: 5,
  },
  membersContainer: {
    marginVertical: 10,
    marginBottom: 40,
  },
  membersList: {
    marginVertical: 15,
    width: "100%",
    maxHeight: 100,
  },
  member: { marginVertical: 5, marginHorizontal: 10 },
  addMemberButton: { alignSelf: "flex-end", marginHorizontal: 10 },
  emptyMembers: { color: Colors.gray, fontSize: 12, margin: 10 },
  createButton: {
    backgroundColor: Colors.primary,
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: "5%",
  },
  screen: {
    flex: 1,
    margin: 10,
  },
});
export default CreateGroupOverlay;
