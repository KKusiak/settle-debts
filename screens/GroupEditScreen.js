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
import { deleteGroup, updateGroup } from "../store/actions/groups";
import {
  deleteMember,
  deleteGroupOperations,
} from "../store/actions/operations";

const GroupEditScreen = (props) => {
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
    });
  }, [isFocused]);

  // effect updating store
  useEffect(() => {
    const time = setTimeout(() => {
      dispatch(updateGroup({ ...newGroup }, newGroup.id));
      navigation.setOptions({
        title: newGroup.title,
      });
    }, 1000);
    return () => clearTimeout(time);
  }, [navigation, newGroup]);
  //
  const deleteHandler = (index) => {
    if (newGroup.members.length > 2) {
      dispatch(deleteMember(newGroup.id, newGroup.members[index].id));
      newGroup.members.splice(index, 1);
      setNewGroup({ ...newGroup });
    } else {
      Alert.alert(
        "Can't remove member",
        "Group must have at least two members"
      );
    }
  };
  //
  const addMemberHandler = () => {
    if (newMemberName.length) {
      const newMember = {
        id: Math.floor(Math.random() * 10000),
        name: newMemberName,
        balance: 0,
      };
      const updatedGroup = { ...newGroup };
      updatedGroup.members.push(newMember);
      setNewGroup({ ...updatedGroup });
    } else {
      Alert.alert(
        "Can't add member",
        "Member's name must be at least one character long"
      );
    }
  };
  const onDeleteGroup = () => {
    Alert.alert("Are you sure?", "This operation is permament", [
      {
        text: "No",
      },
      {
        text: "Yes",
        onPress: () => {
          navigation.navigate("GroupsList");
          dispatch(deleteGroupOperations(group.id));
          dispatch(deleteGroup(group.id));
        },
      },
    ]);
  };
  const renderMemberItem = (itemData) => {
    return (
      <View style={styles.memberItemContainer}>
        <Text style={{ flex: 1 }}>{itemData.item.name}</Text>
        <TouchableOpacity
          style={styles.memberItemDeleteButton}
          onPress={() => {
            deleteHandler(itemData.index);
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
          placeholder='Description'
          inputValue={newGroup.description}
          onChangeText={(newDescription) => {
            newGroup.description = newDescription;
            setNewGroup({ ...newGroup });
          }}
        />
        <Text>Members</Text>
        <FlatList
          data={newGroup.members}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(itemData) => renderMemberItem(itemData)}
          style={styles.membersList}
          persistentScrollbar={true}
        />
        <Input
          placeholder='Name'
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
          <Text>Add member</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          onDeleteGroup();
        }}
        style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete this group</Text>
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
