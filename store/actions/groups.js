import firebase from "firebase";

export const CREATE_GROUP = "CREATE_GROUP";
export const UPDATE_GROUP = "UPDATE_GROUP";
export const DELETE_GROUP = "DELETE_GROUP";
export const TOGGLE_SELECTED = "TOGGLE_SELECTED";
export const SET_GROUPS = "SET_GROUPS";
export const getGroups = () => {
  return (dispatch, getState) => {
    return firebase
      .firestore()
      .collection(`/Groups/`)
      .where("membersIds", "array-contains", firebase.auth().currentUser.uid)
      .onSnapshot(function (querySnapshot) {
        const groups = [];
        querySnapshot.forEach(function (doc) {
          const docData = doc.data();
          console.log(docData);
          const group = { id: doc.id, ...docData };
          groups.push(group);
        });
        dispatch({ type: SET_GROUPS, groups: groups });
      });
  };
};
export const createGroup = (group) => {
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection(`/RegisteredUsers/${firebase.auth().currentUser.uid}/groups`)
      .add(group)
      .then((docRef) => {
        group.id = docRef.id;
        dispatch({ type: CREATE_GROUP, group });
      });
  };
};
export const updateGroup = (group, id) => {
  return {
    type: UPDATE_GROUP,
    groupId: id,
    group: group,
  };
};
export const deleteGroup = (id) => {
  return {
    type: DELETE_GROUP,
    groupId: id,
  };
};
export const toggleSelected = (id) => {
  return {
    type: TOGGLE_SELECTED,
    groupId: id,
  };
};
