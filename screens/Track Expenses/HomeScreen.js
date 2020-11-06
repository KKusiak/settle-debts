import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  RefreshControl,
} from "react-native";
import { useDispatch } from "react-redux";
import Category from "../../components/Track Expenses/Category";
import * as Currencies from "../../models/Currency";
import { VictoryPie, VictoryLabel } from "victory-native";
import Svg from "react-native-svg";
import { useSelector } from "react-redux";
import Colors from "../../constants/Colors";
import {
  FlingGestureHandler,
  Directions,
  State,
} from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  getExpenditure,
  getExpenditures,
} from "../../store/actions/expenditures";
const HomeScreen = (props) => {
  const categories = useSelector((state) => state.expenditures.categories);
  const dispatch = useDispatch();
  // swipe down to refresh functionality
  const [refreshing, setRefreshing] = React.useState(false);
  const [monthOffset, setMonthOffSet] = useState(0);
  const date = useMemo(() => new Date(), [monthOffset]);
  const firstDay = useMemo(
    () => new Date(date.getFullYear(), date.getMonth() + monthOffset, 1),
    [monthOffset]
  );
  const lastDay = useMemo(
    () => new Date(date.getFullYear(), date.getMonth() + (monthOffset + 1), 0),
    [monthOffset]
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(getExpenditures(firstDay, lastDay))
      .then(() => {
        setRefreshing(false);
      })
      .catch((error) => {
        setRefreshing(false);
        console.log(error);
      });
  }, [monthOffset]);
  //
  const onNextMonth = () => {
    if (date.getMonth() > lastDay.getMonth()) {
      setMonthOffSet((current) => {
        return current + 1;
      });
    } else {
      alert("Sorry, no back to the future");
    }
  };
  const onPrevMonth = () => {
    setMonthOffSet((current) => {
      return current - 1;
    });
  };
  useEffect(() => {
    console.log(monthOffset);
    console.log(firstDay);
    console.log(lastDay);
    onRefresh();
  }, [monthOffset]);
  const sumSpent = useMemo(() => {
    let sum = Currencies.PLN(0);
    categories.forEach((cat) => (sum = sum.add(cat.spent)));
    return sum;
  }, [categories]);
  const chart = () => (
    <View>
      <View
        style={{
          flexDirection: "row",
          marginTop: 40,
          marginHorizontal: 20,
          justifyContent: "space-between",
        }}>
        <TouchableOpacity
          onPress={() => {
            onPrevMonth();
          }}>
          <Text style={{ fontSize: 18 }}>Prev month</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{`${
          firstDay.getMonth() + 1
        }.${firstDay.getFullYear()}`}</Text>
        <TouchableOpacity
          onPress={() => {
            onNextMonth();
          }}>
          <Text style={{ fontSize: 18 }}>Next month</Text>
        </TouchableOpacity>
      </View>
      <Svg width={300} height={300} style={{ alignSelf: "center" }}>
        {sumSpent > 0 ? (
          <VictoryPie
            standalone={false}
            animate={{ duration: 2000 }}
            width={300}
            height={300}
            data={categories}
            x='name'
            y='spent.value'
            innerRadius={120}
            labels={() => null}
            style={{
              data: {
                fill: (d) => d.datum.icon.color,
              },
            }}
          />
        ) : (
          <VictoryPie
            standalone={false}
            animate={{ duration: 2000 }}
            width={300}
            height={300}
            data={[{ x: 1, y: 100 }]}
            innerRadius={120}
            labels={() => null}
            style={{
              data: {
                fill: (d) => Colors.gray,
              },
            }}
          />
        )}
        <VictoryLabel
          textAnchor='middle'
          style={{ fill: sumSpent > 0 ? "black" : Colors.gray, fontSize: 22 }}
          x={150}
          y={150}
          text={`Wydatki\n ${sumSpent.format()}`}
        />
      </Svg>
    </View>
  );

  return (
    <FlingGestureHandler
      direction={Directions.LEFT}
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
          onNextMonth();
        }
      }}>
      <FlingGestureHandler
        direction={Directions.RIGHT}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            onPrevMonth();
          }
        }}>
        <View style={styles.screen}>
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            numColumns={3}
            data={categories}
            ListHeaderComponent={chart}
            columnWrapperStyle={{
              justifyContent: "space-around",
              marginBottom: 20,
            }}
            renderItem={(itemData) => (
              <Category
                category={itemData.item}
                navigation={props.navigation}
                monthOffset={monthOffset}
              />
            )}
          />
        </View>
      </FlingGestureHandler>
    </FlingGestureHandler>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
  },
  monthText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default HomeScreen;
