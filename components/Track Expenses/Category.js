import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { init, localized } from "../../lozalization/localized";
import { Icon } from "react-native-elements";
import Colors from "../../constants/Colors";
const Category = (props) => {
  init();

  const { buttonColor, category } = props;

  const active = category.spent.value !== 0 ? true : false;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          height: 100,
          margin: 5,
          flexDirection: "column",
        },
        nameText: {
          color: active === true ? "black" : Colors.gray,
        },
        spentText: {
          color: active === true ? category.icon.color : Colors.gray,
          fontWeight: "bold",
        },
      }),
    [category]
  );

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        props.navigation.navigate("NewExpenditure", {
          category: { name: category.name, icon: category.icon },
          monthOffset: props.monthOffset,
        });
      }}>
      <Text style={styles.nameText}>{category.name}</Text>
      <Icon
        name={category.icon.name}
        type={category.icon.type}
        color={category.icon.color}
        size={category.icon.size}
        containerStyle={active === true ? null : { opacity: 0.5 }}
        reverse={true}
      />
      <Text style={styles.spentText}>{category.spent.format()}</Text>
    </TouchableOpacity>
  );
};

export default Category;
