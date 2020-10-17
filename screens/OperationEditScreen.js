import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import CheckBox from "@react-native-community/checkbox";
import { Picker } from "@react-native-community/picker";
import Input from "../components/Input";
import Colors from "../constants/Colors";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { updateOperation, deleteOperation } from "../store/actions/operations";
import { updateGroup } from "../store/actions/groups";
import * as Currencies from "../models/Currency";
const OperationEditScreen = (props) => {
  const { operationId, groupId } = props.route.params;
  const { navigation } = props;
  const dispatch = useDispatch();

  const [operation, setOperation] = useState(
    useSelector((state) => state.operations.operations).find(
      (obj) => obj.operationId === operationId
    )
  );

  const [group, setGroup] = useState(
    useSelector((state) => state.groups.groups).find(
      (obj) => obj.id === groupId
    )
  );

  //
  const payer = group.members.find((user) => user.id === operation.payer.id);
  //
  const [newTitle, setNewTitle] = useState(operation.title);
  const [newValue, setNewValue] = useState(operation.value);
  const [selectedMember, setSelectedMember] = useState(payer.id);
  //
  const toggleRecipent = (userId) => {
    if (operation.recipents.find((obj) => obj.id === userId) !== undefined) {
      deleteRecipent(userId);
    } else {
      addRecipent(userId);
    }
  };
  const deleteRecipent = (userId) => {
    const updatedRecipents = operation.recipents.filter(
      (obj) => obj.id !== userId
    );
    setOperation((currState) => {
      return { ...currState, recipents: [...updatedRecipents] };
    });
  };
  const addRecipent = (userId) => {
    const updatedRecipents = operation.recipents;
    updatedRecipents.push({ id: userId });
    console.log(updatedRecipents);
    setOperation((currState) => {
      return { ...currState, recipents: [...updatedRecipents] };
    });
  };
  //
  const changePayer = (itemValue) => {
    setSelectedMember(itemValue);
    const updatedOperation = { ...operation };
    updatedOperation.payer.id = itemValue;
    if (
      updatedOperation.recipents.find(
        (recipent) => recipent.id === updatedOperation.payer.id
      ) === undefined
    ) {
      updatedOperation.recipents.push({ id: updatedOperation.payer.id });
    }
    setOperation({ ...updatedOperation });
  };
  //
  const deleteOperationHandler = () => {
    Alert.alert("Are you sure?", "This operation is permament", [
      {
        text: "No",
      },
      {
        text: "Yes",
        onPress: () => {
          const moneyBorrowedPerRecipent = operation.value.divide(
            operation.recipents.length
          );
          const updatedGroup = { ...group };
          const indexPayer = updatedGroup.members.findIndex(
            (member) => member.id === operation.payer.id
          );

          updatedGroup.members[indexPayer].balance = updatedGroup.members[
            indexPayer
          ].balance.subtract(operation.value);
          operation.recipents.forEach((recipent) => {
            const index = updatedGroup.members.findIndex(
              (user) => user.id === recipent.id
            );

            updatedGroup.members[index].balance = updatedGroup.members[
              index
            ].balance.add(moneyBorrowedPerRecipent);
          });

          navigation.navigate("GroupOperations");
          dispatch(deleteOperation(operation.operationId));
          dispatch(updateGroup(updatedGroup, group.id));
        },
      },
    ]);
  };

  // dispatch saving operation to store
  useEffect(() => {
    props.navigation.setOptions({
      title: operation.title,
    });
    dispatch(updateOperation(operationId, { ...operation }));
  }, [operation, navigation]);

  const renderMember = (memberData) => {
    const member = memberData.item;
    const isRecipent =
      operation.recipents.find((recipent) => recipent.id === member.id) !==
      undefined
        ? true
        : false;
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <CheckBox
            tintColors={{
              true:
                member.id === operation.payer.id ? Colors.gray : Colors.primary,
            }}
            disabled={member.id === operation.payer.id ? true : false}
            value={isRecipent}
            onValueChange={(newValue) => {
              toggleRecipent(member.id);
            }}
          />
          <Text>{member.name}</Text>
        </View>
        {isRecipent ? (
          <Text>
            {operation.value.divide(operation.recipents.length).format()}
          </Text>
        ) : null}
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
          inputValue={operation.title}
          onChangeText={(newText) => {
            const updatedOperation = { ...operation, title: newText };
            setOperation(updatedOperation);
          }}
        />
        <Input
          leftIcon={
            <MaterialIcons name='attach-money' size={30} color={Colors.gray} />
          }
          placeholder='Amount'
          keyboardType='numeric'
          inputValue={operation.value.value.toString()}
          onChangeText={(newText) => {
            if (newText === "") newText = "0";
            const updatedOperation = {
              ...operation,
              value: Currencies.PLN(newText),
            };
            setOperation(updatedOperation);
          }}
        />
        <View style={styles.pickerContainer}>
          <Text>Paid by:</Text>
          <Picker
            selectedValue={selectedMember}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => changePayer(itemValue)}>
            {group.members.map((member) => (
              <Picker.Item
                key={member.id}
                label={member.name}
                value={member.id}
              />
            ))}
          </Picker>
        </View>

        <Text>Recipents:</Text>
        <FlatList
          data={group.members}
          renderItem={(itemData) => renderMember(itemData)}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={deleteOperationHandler}>
          <Text style={styles.deleteButtonText}>Delete this operation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1, margin: 20 },
  deleteButton: { alignSelf: "center", marginBottom: 20 },
  deleteButtonText: { color: "red", fontSize: 16 },
  pickerContainer: { flexDirection: "row", alignItems: "center" },
  picker: { width: 150, height: 100 },
});
export default OperationEditScreen;
