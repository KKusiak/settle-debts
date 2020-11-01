import React, { useEffect, useLayoutEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import Input from "../components/Input";
import Colors from "../constants/Colors";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useSelector, useDispatch, useStore } from "react-redux";
import { deleteGroup, updateGroup, addMember } from "../store/actions/groups";
import { deleteGroupOperations } from "../store/actions/operations";
import firebase from "firebase";
import * as Currencies from "../models/Currency";
import { localized, init } from "../lozalization/localized";
const GroupEditScreen = (props) => {
  init();
  const { navigation } = props;
  const { groupId } = props.route.params;

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [newMemberName, setMemberName] = useState("");
  //
  const group = useSelector((state) => state.groups.groups).find(
    (obj) => obj.id === groupId
  );
  //
  const [newGroup, setNewGroup] = useState({ ...group });
  useEffect(() => {
    navigation.setOptions({
      title: newGroup.title,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("GroupsList");
            dispatch(updateGroup({ ...newGroup }, newGroup.id));
          }}>
          <MaterialIcons name='save' color='black' size={30} />
        </TouchableOpacity>
      ),
      headerRightContainerStyle: { marginHorizontal: 20 },
    });
  }, [navigation, newGroup]);

  // effect updating store

  const deleteHandler = (index, memberId) => {
    if (newGroup.members.length > 2) {
      firebase
        .firestore()
        .collection(`Groups/${group.id}/operations`)
        .where("recipents", "array-contains", memberId)
        .get()
        .then((colRef) => {
          if (colRef.docs.length === 0) {
            newGroup.members.splice(index, 1);
            newGroup.membersIds = newGroup.membersIds.filter(
              (member) => member !== memberId
            );
            setNewGroup({ ...newGroup });
          } else {
            Alert.alert(
              localized("Can't remove member"),
              localized("The member participates in at least one transaction")
            );
          }
        });
    } else {
      Alert.alert(
        localized("Can't remove member"),
        localized("Group must have at least two members")
      );
    }
  };
  //
  const addMemberHandler = () => {
    if (newMemberName.length) {
      const newMember = {
        email: "",
        name: newMemberName,
        balance: Currencies.PLN(0),
      };
      dispatch(addMember(newMember)).then((member) => {
        const updatedGroup = { ...newGroup };
        updatedGroup.members.push(member);
        updatedGroup.membersIds.push(member.id);
        setNewGroup({ ...updatedGroup });
      });
    } else {
      Alert.alert(
        localized("Can't add member"),
        localized("Member's name must be at least one character long")
      );
    }
  };
  const onDeleteGroup = () => {
    Alert.alert(
      localized("Are you sure?"),
      localized("This operation is permament"),
      [
        {
          text: localized("No"),
        },
        {
          text: localized("Yes"),
          onPress: () => {
            navigation.navigate("GroupsList");
            dispatch(deleteGroupOperations(group.id));
            dispatch(deleteGroup(group.id, group));
          },
        },
      ]
    );
  };
  const renderMemberItem = (itemData) => {
    return (
      <View style={styles.memberItemContainer}>
        <Text style={{ flex: 1 }}>{itemData.item.name}</Text>
        <TouchableOpacity
          style={styles.memberItemDeleteButton}
          onPress={() => {
            deleteHandler(itemData.index, itemData.item.id);
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
          placeholder={localized("Title")}
          inputValue={newGroup.title}
          onChangeText={(newTitle) => {
            newGroup.title = newTitle;
            setNewGroup({ ...newGroup });
          }}
        />
        <Input
          leftIcon={
            <MaterialIcons name='description' size={30} color={Colors.gray} />
          }
          placeholder={localized("Description")}
          inputValue={newGroup.description}
          onChangeText={(newDescription) => {
            newGroup.description = newDescription;
            setNewGroup({ ...newGroup });
          }}
        />
        <Text>{localized("Members")}</Text>
        <FlatList
          data={newGroup.members}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(itemData) => renderMemberItem(itemData)}
          style={styles.membersList}
          persistentScrollbar={true}
        />
        <Input
          placeholder={localized("Name")}
          leftIcon={
            <MaterialIcons
              name='person-outline'
              size={30}
              color={Colors.gray}
            />
          }
          inputValue={newMemberName}
          onChangeText={(newText) => {
            setMemberName(newText);
          }}
          validatingFunction={() => {}}
          renderError={true}
          onSubmitEditing={() => {}}
        />
        <TouchableOpacity
          onPress={() => {
            addMemberHandler();
          }}
          style={styles.addMemberButton}>
          <Text>{localized("Add member")}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          onDeleteGroup();
        }}
        style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>
          {localized("Delete this group")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1, margin: 10 },
  overlayStyle: { width: "70%", paddingVertical: 20 },

  membersContainer: {
    marginVertical: 10,
    marginBottom: 40,
  },
  membersList: {
    marginVertical: 15,
    width: "100%",
    maxHeight: 200,
  },
  member: { marginVertical: 5, marginHorizontal: 10 },
  addMemberButton: { alignSelf: "flex-end", marginHorizontal: 10 },
  memberItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10,
  },
  memberItemDeleteButton: { marginLeft: 20 },
  deleteButton: { alignSelf: "center", marginBottom: 20 },
  deleteButtonText: { color: "red", fontSize: 16 },
});
export default GroupEditScreen;
