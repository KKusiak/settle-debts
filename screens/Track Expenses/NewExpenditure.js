import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Currencies from "../../models/Currency";
import Input from "../../components/Input";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { init, localized } from "../../lozalization/localized";
import { useDispatch } from "react-redux";
import { createExpenditure } from "../../store/actions/expenditures";
const NewExpenditure = (props) => {
  init();
  const dispatch = useDispatch();
  const { category, monthOffset } = props.route.params;
  const [newExpenditure, setNewExpenditure] = useState({
    name: "",
    value: Currencies.PLN(0),
    category: category.name,
  });
  useEffect(() => {
    props.navigation.setOptions({
      title: category.name,
      headerStyle: {
        backgroundColor: category.icon.color,
      },
      headerTintColor: "#fff",
    });
  }, [category]);
  const onAddExpenditure = () => {
    dispatch(createExpenditure(newExpenditure, monthOffset))
      .then(() => {
        props.navigation.navigate("HomeScreen");
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };
  return (
    <View style={styles.screen}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Input
          leftIcon={
            <MaterialIcons name='title' size={30} color={Colors.gray} />
          }
          placeholder={localized("Title (optional)")}
          inputValue={newExpenditure.name}
          onChangeText={(newText) => {
            const updated = { ...newExpenditure, name: newText };
            setNewExpenditure(updated);
          }}
        />
        <Input
          leftIcon={
            <MaterialIcons name='attach-money' size={30} color={Colors.gray} />
          }
          placeholder={localized("Amount")}
          keyboardType='numeric'
          inputValue={newExpenditure.value.value.toString()}
          onChangeText={(newText) => {
            const updated = {
              ...newExpenditure,
              value: Currencies.PLN(newText),
            };
            setNewExpenditure(updated);
          }}
        />
      </View>
      <View style={styles.addButton}>
        <TouchableOpacity
          onPress={() => {
            onAddExpenditure();
          }}>
          <Text style={styles.addButtonText}>
            {localized("Add expenditure")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    margin: 20,
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: 20,
    color: Colors.primary,
    textAlign: "center",
  },
  addButton: {
    marginBottom: 40,
  },
});
export default NewExpenditure;
