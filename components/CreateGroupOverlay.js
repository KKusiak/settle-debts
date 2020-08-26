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
const CreateGroupOverlay = (props) => {
  const [isMemberEmpty, setIsMembersEmpty] = useState(true);
  return (
    <Fragment>
      <Text>Create new group</Text>
      <View style={styles.validatedField}>
        <MaterialIcons name='title' size={20} color={Colors.gray} />
        <TextInput
          style={styles.textInput}
          placeholder='title'
          value={props.newGroup.title}
          onChangeText={(newText) => {
            props.setNewGroup((group) => {
              return { ...group, title: newText };
            });
          }}
        />
      </View>
      <View style={styles.validatedField}>
        <MaterialIcons name='description' size={20} color={Colors.gray} />
        <TextInput
          style={styles.textInput}
          placeholder='description'
          value={props.newGroup.description}
          onChangeText={(newText) => {
            props.setNewGroup((group) => {
              return { ...group, description: newText };
            });
          }}
        />
      </View>
      <View style={styles.membersContainer}>
        <Text>Members</Text>
        {isMemberEmpty ? (
          <Text style={styles.emptyMembers}>Add users to group</Text>
        ) : (
          <FlatList
            data={props.newGroup.members}
            keyExtractor={(item) => item}
            renderItem={(itemData) => (
              <Text style={styles.member}>{itemData.item}</Text>
            )}
            style={styles.membersList}
          />
        )}

        <View style={styles.validatedField}>
          <MaterialIcons name='person-outline' size={20} color={Colors.gray} />
          <TextInput
            style={styles.textInput}
            placeholder='name'
            value={props.memberName}
            onChangeText={(newText) => {
              props.setMemberName(newText);
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            props.onAddMember();
            setIsMembersEmpty(false);
          }}
          style={styles.addMemberButton}>
          <Text>Add member</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={props.onAddToList} style={styles.button}>
        <Text style={{ color: "white" }}>CREATE</Text>
      </TouchableOpacity>
    </Fragment>
  );
};
const styles = StyleSheet.create({
  overlayStyle: { width: "70%", paddingVertical: 20 },
  button: {
    backgroundColor: Colors.primary,
    height: 30,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
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
    minHeight: 100,
    width: "100%",
    maxHeight: 100,
  },
  member: { marginVertical: 5, marginHorizontal: 10 },
  addMemberButton: { alignSelf: "flex-end", marginHorizontal: 10 },
  emptyMembers: { color: Colors.gray, fontSize: 12, margin: 10 },
});
export default CreateGroupOverlay;
