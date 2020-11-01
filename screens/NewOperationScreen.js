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
import { createOperation } from "../store/actions/operations";
import { init, localized } from "../lozalization/localized";
import * as Currencies from "../models/Currency";
const NewOperationScreen = (props) => {
  init();
  const dispatch = useDispatch();
  const { groupId } = props.route.params;
  const { navigation } = props;
  const users = useSelector((state) => state.users.users);
  const group = useSelector((state) => state.groups.groups).find(
    (obj) => obj.id === groupId
  );

  const groupMembers = group.members.map((obj) => {
    const user = users.find((user) => user.id === obj.id);
    return { ...user, ...obj };
  });
  const [tempValue, setTempValue] = useState(Currencies.PLN(1));
  const [operation, setOperation] = useState({
    title: "",
    value: Currencies.PLN(1),
    payer: groupMembers[0].id,
    recipents: [groupMembers[0].id],
  });
  const [selectedMember, setSelectedMember] = useState({
    id: operation.payer.id,
  });
  const toggleRecipent = (userId) => {
    if (isRecipent(userId) === true) {
      deleteRecipent(userId);
    } else {
      addRecipent(userId);
    }
  };

  const changePayer = (itemValue) => {
    setSelectedMember(itemValue);
    const updatedOperation = { ...operation };
    updatedOperation.payer = itemValue;
    if (
      updatedOperation.recipents.find(
        (recipent) => recipent === updatedOperation.payer
      ) === undefined
    ) {
      updatedOperation.recipents.push(updatedOperation.payer);
    }
    setOperation({ ...updatedOperation });
  };
  const deleteRecipent = (userId) => {
    const updatedRecipents = operation.recipents.filter(
      (obj) => obj !== userId
    );
    setOperation((currState) => {
      return { ...currState, recipents: [...updatedRecipents] };
    });
  };
  const addRecipent = (userId) => {
    const updatedRecipents = operation.recipents;

    updatedRecipents.push(userId);
    setOperation((currState) => {
      return { ...currState, recipents: [...updatedRecipents] };
    });
  };
  const isRecipent = (id) => {
    return !!operation.recipents.find((obj) => obj === id);
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const updatedOperation = {
        ...operation,
        value: tempValue,
      };
      setOperation(updatedOperation);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [tempValue]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: localized("Create new operation"),
    });
  }, [navigation]);
  const createOperationHandler = () => {
    if (operation.title.length === 0) {
      Alert.alert(
        localized("Invalid title"),
        localized("Title can't be empty")
      );
      return -1;
    }
    if (operation.value.value === 0) {
      Alert.alert(
        localized("Invalid value"),
        localized("Value must be greater than 0")
      );
      return -1;
    }
    const readyOperation = {
      ...operation,
      groupId: group.id,
    };
    /////////////////////////
    const recipentsList = readyOperation.recipents.map((recipent) => recipent);
    //////////////////////

    const updatedMembers = group.members.map((member) => {
      const recipent = recipentsList.find((obj) => obj === member.id);

      if (member.id === operation.payer) {
        member.balance = member.balance.add(operation.value);
      }

      if (recipent !== undefined) {
        member.balance = member.balance.subtract(
          operation.value.divide(operation.recipents.length)
        );
      }

      return { ...member };
    });

    dispatch(
      createOperation(readyOperation, { ...group, members: updatedMembers })
    );
    navigation.navigate("GroupOperations");
  };
  const renderMember = (memberData) => {
    const member = memberData.item;
    const isRecipent =
      operation.recipents.find((recipent) => recipent === member.id) !==
      undefined
        ? true
        : false;

    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <CheckBox
            tintColors={{
              true:
                member.id === operation.payer ? Colors.gray : Colors.primary,
            }}
            disabled={member.id === operation.payer ? true : false}
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
          placeholder={localized("Title")}
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
          placeholder={localized("Amount")}
          keyboardType='numeric'
          inputValue={tempValue.value.toString()}
          onChangeText={(newText) => {
            setTempValue(Currencies.PLN(newText));
          }}
        />
        <View style={styles.pickerContainer}>
          <Text>{localized("Paid by")}:</Text>
          <Picker
            selectedValue={selectedMember}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => changePayer(itemValue)}>
            {groupMembers.map((member) => (
              <Picker.Item
                key={member.id}
                label={member.name}
                value={member.id}
              />
            ))}
          </Picker>
        </View>

        <Text>{localized("Recipents")}:</Text>
        <FlatList
          data={groupMembers}
          renderItem={(itemData) => renderMember(itemData)}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View>
        <TouchableOpacity
          style={styles.createOperationButton}
          onPress={createOperationHandler}>
          <Text style={styles.createOperationText}>
            {localized("Create operation")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1, margin: 20 },
  createOperationButton: {
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  createOperationText: { color: Colors.primary, fontSize: 16 },
  pickerContainer: { flexDirection: "row", alignItems: "center" },
  picker: { width: 150, height: 100 },
});
export default NewOperationScreen;
