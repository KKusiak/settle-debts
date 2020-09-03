import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import Operation from "../../components/Operation";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
const OperationsScreen = (props) => {
  const operations = [
    { title: "Fuel", payer: "Mark", value: 50 },
    { title: "Hotel", payer: "Henry", value: 350 },
    { title: "Lunch at castle", payer: "David", value: 65 },
    { title: "Fuel", payer: "Mark", value: 50 },
    { title: "Hotel", payer: "Henry", value: 350 },
    { title: "Hotel", payer: "Henry", value: 350 },
    { title: "Lunch at castle", payer: "David", value: 65 },
    { title: "Fuel", payer: "Mark", value: 50 },
    { title: "Hotel", payer: "Henry", value: 350 },
    { title: "Hotel", payer: "Henry", value: 350 },
    { title: "Lunch at castle", payer: "David", value: 65 },
    { title: "Fuel", payer: "Mark", value: 50 },
    { title: "Hotel", payer: "Henry", value: 350 },
    { title: "Hotel", payer: "Henry", value: 350 },
    { title: "Lunch at castle", payer: "David", value: 65 },
    { title: "Fuel", payer: "Mark", value: 50 },
    { title: "Hotel", payer: "Henry", value: 350 },
  ];
  return (
    <View style={styles.screen}>
      <View style={{ flex: 1, marginBottom: 20 }}>
        <FlatList
          data={operations}
          keyExtractor={(item) =>
            Math.floor(Math.random() * 100000 + 1).toString()
          }
          renderItem={(itemData) => (
            <Operation
              operation={itemData.item}
              navigation={props.navigation}
            />
          )}
        />
      </View>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity style={styles.addButton} onPress={() => {}}>
          <AntDesign name='plus' color='white' size={27} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1, padding: 40, paddingBottom: 0 },
  addButton: {
    borderRadius: 50,
    width: 60,
    height: 60,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default OperationsScreen;
