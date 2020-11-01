import React, { useState, Fragment } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  BackHandler,
  Alert,
} from "react-native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import Input from "../components/Input";
import { useDispatch } from "react-redux";
import { createGroup, addMember, deleteMember } from "../store/actions/groups";
import firebase, { firestore } from "firebase";
import * as Currencies from "../models/Currency";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-community/picker";
import { init, localized } from "../lozalization/localized";
const CreateGroupScreen = (props) => {
  init();
  const [addMemberMethod, setAddMemberMethod] = useState("name");
  const [memberEmail, setMemberEmail] = useState("");
  const dispatch = useDispatch();
  const { navigation } = props;
  const [newMember, setNewMember] = useState({
    name: "",
    balance: Currencies.PLN(0),
    email: "",
  });

  const [group, setGroup] = useState({
    title: "",
    description: "",
    members: [
      {
        id: firebase.auth().currentUser.uid,
        name: firebase.auth().currentUser.displayName,
        balance: Currencies.PLN(0),
        email: firebase.auth().currentUser.email,
      },
    ],
    membersIds: [firebase.auth().currentUser.uid],
  });
  const onAddMember = () => {
    switch (addMemberMethod) {
      case "email": {
        if (validateEmail(memberEmail)) {
          firebase
            .firestore()
            .collection("RegisteredUsers/")
            .where("email", "==", memberEmail.toLowerCase())
            .get()
            .then((colRef) => {
              if (colRef.empty) {
                Alert.alert(
                  localized("User error"),
                  localized(
                    "Sorry user with the provided email does not exist in our database"
                  )
                );
              } else {
                colRef.forEach((docRef) => {
                  const data = docRef.data();
                  const member = {
                    name: data.name,
                    email: data.email,
                    balance: Currencies.PLN(data.balance),
                    id: docRef.id,
                  };
                  const updatedGroup = { ...group };
                  updatedGroup.members.push(member);
                  updatedGroup.membersIds.push(member.id);
                  setGroup(updatedGroup);
                });
              }
            });
          setMemberEmail("");
        } else {
          Alert.alert(
            localized("Email error"),
            localized("Please provide a valid email")
          );
        }
        break;
      }
      case "name": {
        dispatch(addMember(newMember)).then((member) => {
          const updatedGroup = { ...group };
          updatedGroup.members.push(member);
          updatedGroup.membersIds.push(member.id);
          setGroup(updatedGroup);
          setNewMember({
            name: "",
            balance: Currencies.PLN(0),
            email: "",
          });
        });
        break;
      }
    }
  };
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  const onDeleteMember = (index, memberId) => {
    if (group.members[index].id !== firebase.auth().currentUser.uid) {
      if (group.members[index].email === "") {
        dispatch(deleteMember(memberId)).then(() => {
          const updatedGroup = { ...group };
          updatedGroup.members.splice(index, 1);
          updatedGroup.membersIds = updatedGroup.membersIds.filter(
            (member) => member !== memberId
          );
          setGroup(updatedGroup);
          console.log(updatedGroup);
        });
      } else {
        const updatedGroup = { ...group };
        updatedGroup.members.splice(index, 1);
        updatedGroup.membersIds = updatedGroup.membersIds.filter(
          (member) => member !== memberId
        );
        setGroup(updatedGroup);
        console.log(updatedGroup);
      }
    } else {
      alert(localized("You can't remove yourself from the group"));
    }
  };
  const onCreateGroup = () => {
    const readyGroup = { ...group };
    console.log(readyGroup);
    navigation.navigate("GroupsList");
    dispatch(createGroup(readyGroup));
  };
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        group.members.forEach((member) => {
          if (member.email === "") {
            dispatch(deleteMember(member.id)).catch((error) =>
              console.log(error)
            );
            return false;
          } else {
            return true;
          }
        });
        BackHandler.addEventListener("hardwareBackPress", onBackPress);

        return () =>
          BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );
  const renderAddMemberInput = () => {
    switch (addMemberMethod) {
      case "email":
        return (
          <Input
            placeholder='Email'
            leftIcon={<Entypo name='email' size={30} color={Colors.gray} />}
            inputValue={memberEmail}
            onChangeText={(newText) => {
              setMemberEmail(newText);
            }}
            onSubmitEditing={() => {
              onAddMember();
            }}
          />
        );
      default: {
        return (
          <Input
            placeholder='Name'
            leftIcon={
              <MaterialIcons
                name='person-outline'
                size={30}
                color={Colors.gray}
              />
            }
            inputValue={newMember.name}
            onChangeText={(newText) => {
              setNewMember((curr) => {
                return { ...curr, name: newText };
              });
            }}
            onSubmitEditing={() => {
              onAddMember();
            }}
          />
        );
      }
    }
  };
  const renderMemberItem = (itemData) => {
    return (
      <View style={styles.memberItemContainer}>
        <Text style={{ flex: 1 }}>{itemData.item.name}</Text>
        <TouchableOpacity
          style={styles.memberItemDeleteButton}
          onPress={() => {
            onDeleteMember(itemData.index, itemData.item.id);
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
          placeholder={localized("Description")}
          inputValue={group.description}
          onChangeText={(newText) => {
            const updatedGroup = { ...group, description: newText };
            setGroup(updatedGroup);
          }}
        />

        <View style={styles.membersContainer}>
          <Text>{localized("Members")}</Text>
          <View style={styles.membersListContainer}>
            {group.members.length === 0 ? (
              <Text style={styles.emptyMembers}>
                {localized("Add your friends to list")}
              </Text>
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
            <Picker
              selectedValue={addMemberMethod}
              onValueChange={(itemValue, itemIndex) => {
                setAddMemberMethod(itemValue);
              }}>
              <Picker.Item key='name' label={localized("Name")} value='name' />
              <Picker.Item
                key='email'
                label={localized("Add by email")}
                value='email'
              />
            </Picker>
            {renderAddMemberInput()}

            <TouchableOpacity
              onPress={() => {
                onAddMember();
              }}
              style={styles.addMemberButton}>
              <Text>{localized("Add member")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          onCreateGroup();
        }}
        style={styles.createButton}>
        <Text style={{ color: Colors.primary, fontSize: 20 }}>
          {localized("CREATE")}
        </Text>
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
