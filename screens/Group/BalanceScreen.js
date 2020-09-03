import React from "react";
import { View } from "react-native";
import { VictoryAxis, VictoryBar, VictoryChart } from "victory-native";
import Colors from "../../constants/Colors";
const BalanceScreen = (props) => {
  const data = [
    { name: "Mam", balance: 50 },
    { name: "dość", balance: 20 },
    { name: "reacta", balance: -43 },
    { name: "zabij", balance: 70 },
    { name: "mnie", balance: -70 },
  ];
  data.reverse();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <VictoryChart>
        <VictoryBar
          data={data}
          x='name'
          y='balance'
          horizontal={true}
          alignment='middle'
          labels={({ datum }) => `${datum.balance}`}
          barRatio={1.5}
          textAnchor='middle'
          style={{
            data: {
              fill: ({ datum }) => (datum.balance >= 0 ? "#0F0" : "#F00"),
            },
          }}
        />
        <VictoryAxis
          crossAxis
          style={{
            axis: { stroke: Colors.gray },
            tickLabels: { fill: Colors.gray },
          }}
        />
      </VictoryChart>
    </View>
  );
};
export default BalanceScreen;
