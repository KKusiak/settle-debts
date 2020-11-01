import firebase from "firebase";
import Operation from "../../models/Operation";
import { updateGroup, UPDATE_GROUP } from "./groups";

export const CREATE_OPERATION = "CREATE_OPERATION";
export const UPDATE_OPERATION = "UPDATE_OPERATION";
export const DELETE_OPERATION = "DELETE_OPERATION";
export const DELETE_MEMBER = "DELETE_MEMBER";
export const DELETE_GROUP_OPERATIONS = "DELETE_GROUP_OPERATIONS";
export const SET_OPERATIONS = "SET_OPERATIONS";
export const getOperations = (groupId) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      const unsubscribe = firebase
        .firestore()
        .collection(`/Groups/${groupId}/operations`)
        .get()
        .then((querySnapshot) => {
          const operations = [];
          querySnapshot.forEach((doc) => {
            const operation = new Operation(doc.data(), doc.id);
            operations.push(operation);
          });
          dispatch({ type: SET_OPERATIONS, operations });
          resolve(unsubscribe);
        });
    });
  };
};
export const getOperation = (operationId, groupId) => {
  return (dispatch) => {
    const unsubscribe = firebase
      .firestore()
      .doc(`Groups/${groupId}/operations/${operationId}`)
      .get()
      .then((documentSnapshot) => {
        const operation = new Operation(
          documentSnapshot.data(),
          documentSnapshot.id
        );
      });
  };
};
export const createOperation = (operation, group) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection(`Groups/${group.id}/operations`)
        .add({ ...operation, value: operation.value.value })
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
          operation.id = docRef.id;
          const readyGroup = {
            ...group,
            members: group.members.map((member) => {
              return { ...member, balance: member.balance.value };
            }),
          };

          firebase
            .firestore()
            .doc(`Groups/${group.id}`)
            .update(readyGroup)
            .then(() => {
              dispatch({ type: CREATE_OPERATION, operation });
              dispatch({ type: UPDATE_GROUP, group });
              resolve();
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
        });
    });
  };
};
export const updateOperation = (operation, group) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .doc(`Groups/${operation.groupId}/operations/${operation.id}`)
        .update({ ...operation, value: operation.value.value })
        .then(() => {
          dispatch({
            type: UPDATE_OPERATION,
            operation,
            operationId: operation.id,
          });
          resolve(operation);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };
};
export const deleteOperation = (operation, group) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .doc(`Groups/${operation.groupId}/operations/${operation.id}`)
        .delete()
        .then(() => {
          dispatch({ type: DELETE_OPERATION, operationId: operation.id });
          dispatch(updateGroup(group, group.id))
            .then(() => {
              resolve();
            })
            .catch((error) => {
              console.log(error);
              reject();
            });
        });
    });
  };
};
export const deleteMember = (groupId, memberId) => {
  return {
    type: DELETE_MEMBER,
    groupId,
    memberId,
  };
};
export const deleteGroupOperations = (groupId) => {
  return {
    type: DELETE_GROUP_OPERATIONS,
    groupId,
  };
};
