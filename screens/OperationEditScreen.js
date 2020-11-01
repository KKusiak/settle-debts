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
import lodashCloneDeep from "lodash.clonedeep";
import { init, localized } from "../lozalization/localized";
const OperationEditScreen = (props) => {
  init();
  const { operationId, groupId } = props.route.params;
  const { navigation } = props;
  const dispatch = useDispatch();

  const [operation, setOperation] = useState(
    useSelector((state) => state.operations.operations).find(
      (obj) => obj.operationId === operationId
    )
  );
  const [oldOperation, setOldOperation] = useState(lodashCloneDeep(operation));

  const [group, setGroup] = useState(
    useSelector((state) => state.groups.groups).find(
      (obj) => obj.id === groupId
    )
  );

  //
  const payer = group.members.find((user) => user.id === operation.payer);
  //
  const [newTitle, setNewTitle] = useState(operation.title);
  const [newValue, setNewValue] = useState(operation.value);
  const [selectedMember, setSelectedMember] = useState(payer);
  //
  const toggleRecipent = (userId) => {
    if (operation.recipents.find((obj) => obj === userId) !== undefined) {
      deleteRecipent(userId);
    } else {
      addRecipent(userId);
    }
  };
  const deleteRecipent = (userId) => {
    const updatedRecipents = operation.recipents.filter(
      (obj) => obj !== userId
    );

    setOperation((currState) => {
      const updatedOperation = {
        ...currState,
        recipents: [...updatedRecipents],
      };

      return updatedOperation;
    });
  };
  const addRecipent = (userId) => {
    const updatedRecipents = operation.recipents;
    updatedRecipents.push(userId);

    setOperation((currState) => {
      const updatedOperation = {
        ...currState,
        recipents: [...updatedRecipents],
      };

      return updatedOperation;
    });
  };
  //
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
    setOperation((currState) => {
      return updatedOperation;
    });
  };
  //
  const deleteOperationHandler = () => {
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
            const moneyBorrowedPerRecipent = operation.value.divide(
              operation.recipents.length
            );
            const updatedGroup = { ...group };
            const indexPayer = updatedGroup.members.findIndex(
              (member) => member.id === operation.payer
            );

            updatedGroup.members[indexPayer].balance = updatedGroup.members[
              indexPayer
            ].balance.subtract(operation.value);
            operation.recipents.forEach((recipent) => {
              const index = updatedGroup.members.findIndex(
                (user) => user.id === recipent
              );

              updatedGroup.members[index].balance = updatedGroup.members[
                index
              ].balance.add(moneyBorrowedPerRecipent);
            });

            navigation.navigate("GroupOperations");
            dispatch(deleteOperation(operation, updatedGroup));
          },
        },
      ]
    );
  };
  const updateBalances = (oldOperation, updatedOperation) => {
    const clonedGroup = lodashCloneDeep(group);

    const oldValPerRecipent = oldOperation.value.divide(
      oldOperation.recipents.length
    );
    let payer = clonedGroup.members.find(
      (member) => member.id === oldOperation.payer
    );

    payer.balance = payer.balance.subtract(oldOperation.value);

    oldOperation.recipents.forEach((recipent) => {
      const member =
        clonedGroup.members[
          clonedGroup.members.findIndex((member) => member.id === recipent)
        ];
      member.balance = member.balance.add(oldValPerRecipent);
    });
    const newValPerRecipent = updatedOperation.value.divide(
      updatedOperation.recipents.length
    );
    payer = clonedGroup.members.find(
      (member) => member.id === updatedOperation.payer
    );
    payer.balance = payer.balance.add(updatedOperation.value);
    updatedOperation.recipents.forEach((recipent) => {
      const member =
        clonedGroup.members[
          clonedGroup.members.findIndex((member) => member.id === recipent)
        ];
      member.balance = member.balance.subtract(newValPerRecipent);
    });
    dispatch(updateGroup(clonedGroup, clonedGroup.id));
  };
  // dispatch saving operation to store
  useEffect(() => {
    props.navigation.setOptions({
      title: operation.title,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            updateBalances(oldOperation, operation);
            dispatch(updateOperation({ ...operation }, group));
            navigation.navigate("GroupOperations");
          }}>
          <MaterialIcons name='save' color='black' size={30} />
        </TouchableOpacity>
      ),
      headerRightContainerStyle: { marginHorizontal: 20 },
    });
  }, [navigation, operation, oldOperation]);
  useEffect(() => {
    const newOperation = { ...operation, value: newValue };
    setOperation(newOperation);
  }, [newValue]);
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
          inputValue={newValue.value.toString()}
          onChangeText={(newText) => {
            if (newText === "") newText = "0";
            setNewValue(Currencies.PLN(newText));
          }}
        />
        <View style={styles.pickerContainer}>
          <Text>{localized("Paid by")}:</Text>
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

        <Text>{localized("Recipents")}:</Text>
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
          <Text style={styles.deleteButtonText}>
            {localized("Delete this operation")}
          </Text>
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
