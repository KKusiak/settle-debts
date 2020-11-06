import * as Currencies from "../../models/Currency";
import lodashCloneDeep from "lodash.clonedeep";
import {
  CREATE_EXPENDITURE,
  GET_EXPENDITURES,
  updateExpenditure,
} from "../actions/expenditures";
const initialState = {
  expenditures: [],
  categories: [
    {
      id: "1",
      name: "Zakupy",
      spent: Currencies.PLN(0),
      icon: {
        name: "shopping-basket",
        type: "material",
        color: "#335C67",
        size: 20,
      },
    },
    {
      id: "2",
      name: "Zdrowie",
      spent: Currencies.PLN(0),
      icon: {
        name: "healing",
        type: "material",
        color: "#8338ec",
        size: 20,
      },
    },
    {
      id: "3",
      name: "Wypoczynek",
      spent: Currencies.PLN(0),
      icon: {
        name: "local-movies",
        type: "material",
        color: "#2ec4b6",
        size: 20,
      },
    },
    {
      id: "4",
      name: "Transport",
      spent: Currencies.PLN(0),
      icon: {
        name: "directions-transit",
        type: "material",
        color: "#E09F3E",
        size: 20,
      },
    },
    {
      id: "5",
      name: "Restauracja",
      spent: Currencies.PLN(0),
      icon: {
        name: "restaurant",
        type: "material",
        color: "#25911c",
        size: 20,
      },
    },
    {
      id: "6",
      name: "Samochód",
      spent: Currencies.PLN(0),
      icon: {
        name: "directions-car",
        type: "material",
        color: "#283618",
        size: 20,
      },
    },
    {
      id: "7",
      name: "Prezenty",
      spent: Currencies.PLN(0),
      icon: {
        name: "gift",
        type: "antdesign",
        color: "#9E2A2B",
        size: 20,
      },
    },
  ],
};
export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_EXPENDITURE: {
      const updatedExpenditures = lodashCloneDeep(state.expenditures);
      updatedExpenditures.push(action.expenditure);
      const updatedCategories = lodashCloneDeep(state.categories);
      const category = updatedCategories.find(
        (cat) => cat.name === action.expenditure.category
      );
      category.spent = category.spent.add(action.expenditure.value);

      return {
        ...state,
        expenditures: updatedExpenditures,
        categories: updatedCategories,
      };
    }
    case GET_EXPENDITURES: {
      const updatedCategories = lodashCloneDeep(state.categories);
      updatedCategories.forEach((cat) => (cat.spent = Currencies.PLN(0)));
      action.expenditures.forEach((expenditure) => {
        const category = updatedCategories.find(
          (category) => category.name === expenditure.category
        );
        category.spent = category.spent.add(expenditure.value);
      });
      return {
        ...state,
        expenditures: action.expenditures,
        categories: updatedCategories,
      };
    }
    default: {
      return state;
    }
  }
};
