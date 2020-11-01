import React, { useEffect, useState } from "react";
import { Button, View, FlatList, Text, StyleSheet } from "react-native";
import { VictoryAxis, VictoryBar, VictoryChart } from "victory-native";
import Colors from "../../constants/Colors";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { settleBills } from "../../models/settleBill";
import { localized, init } from "../../lozalization/localized";
import * as firebase from "firebase";
const BalanceScreen = (props) => {
  init();
  const [TMP, setTMP] = useState([]);
  const isFocused = useIsFocused();
  const tabNavigatorState = props.navigation.dangerouslyGetState();
  const groupId = tabNavigatorState.routes.find(
    (route) => route.name === "Operations"
  ).params.groupId;
  const group = useSelector((state) => state.groups.groups).find(
    (group) => group.id === groupId
  );

  useEffect(() => {
    setTMP(settleBills(group.members));
  }, [group]);
  const renderBills = (itemData) => {
    const item = itemData.item;

    return (
      <View style={styles.refundContainer}>
        <Text>
          <Text style={{ fontWeight: "bold" }}>{item.payer} </Text>
          {localized("shouldPay")}
          <Text style={{ fontWeight: "bold" }}> {item.recipent} </Text>
          <Text style={{ fontWeight: "bold", color: Colors.primary }}>
            {item.value.format()}
          </Text>
        </Text>
      </View>
    );
  };
  return (
    <View style={styles.screen}>
      <View style={styles.chartContainer}>
        <VictoryChart padding={100}>
          <VictoryBar
            data={group.members}
            x='name'
            y='balance'
            horizontal={true}
            alignment='middle'
            labels={({ datum }) => {
              return datum.balance.format();
            }}
            barRatio={1.5}
            textAnchor='middle'
            style={{
              data: {
                fill: ({ datum }) =>
                  datum.balance >= 0 ? Colors.primary : Colors.accent,
              },
            }}
          />
          <VictoryAxis
            crossAxis
            style={{
              axis: { stroke: Colors.gray },
              tickLabels: { fill: "black" },
            }}
          />
        </VictoryChart>
      </View>
      <Text style={styles.refunds}>{localized("Refunds")}</Text>
      <FlatList
        data={TMP}
        keyExtractor={(item) => {
          return item.id.toString();
        }}
        renderItem={(itemData) => renderBills(itemData)}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1, margin: 20 },
  chartContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  refundContainer: {
    marginTop: 15,
  },
  refunds: { fontSize: 20 },
});
export default BalanceScreen;
