import firebase from "firebase";
import { exp } from "react-native-reanimated";
import Expenditure from "../../models/Expenditure";
export const GET_EXPENDITURES = "GET_EXPENDITURES";
export const GET_EXPENDITURE = "GET_EXPENDITURE";
export const CREATE_EXPENDITURE = "CREATE_EXPENDITURE";
export const DELETE_EXPENDITURE = "DELETE_EXPENDITURE";
export const UPDATE_EXPENDITURE = "UPDATE_EXPENDITURE";

export const getExpenditures = (startDate, endDate) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection(
          `RegisteredUsers/${firebase.auth().currentUser.uid}/Expenditures`
        )
        .where(
          "creationDate",
          ">",
          firebase.firestore.Timestamp.fromDate(startDate)
        )
        .where(
          "creationDate",
          "<=",
          firebase.firestore.Timestamp.fromDate(endDate)
        )
        .get()
        .then((colRef) => {
          const expenditures = [];
          colRef.forEach((docRef) => {
            expenditures.push(new Expenditure(docRef.data(), docRef.id));
          });
          dispatch({ type: GET_EXPENDITURES, expenditures });
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
};
export const getExpenditure = (expenditureId) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {});
  };
};
export const createExpenditure = (expenditure, monthOffset) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      const now = new Date();
      const expenditureToSave = {
        ...expenditure,
        uid: firebase.auth().currentUser.uid,
        value: expenditure.value.value,
        creationDate: new Date(
          now.getFullYear(),
          now.getMonth() + monthOffset,
          now.getDate()
        ),
      };
      firebase
        .firestore()
        .collection(`RegisteredUsers/${expenditureToSave.uid}/Expenditures/`)
        .add(expenditureToSave)
        .then((docRef) => {
          const readyExpenditure = new Expenditure(
            {
              ...expenditureToSave,
              creationDate: firebase.firestore.Timestamp.fromDate(
                expenditureToSave.creationDate
              ),
            },
            docRef.id
          );
          dispatch({ type: CREATE_EXPENDITURE, expenditure: readyExpenditure });
          resolve();
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };
};
export const updateExpenditure = (expenditure) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {});
  };
};
export const deleteExpenditure = (id) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {});
  };
};
