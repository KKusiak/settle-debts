import firebase, { firestore } from "firebase";
import Group from "../../models/Group";

export const CREATE_GROUP = "CREATE_GROUP";
export const UPDATE_GROUP = "UPDATE_GROUP";
export const DELETE_GROUP = "DELETE_GROUP";
export const TOGGLE_SELECTED = "TOGGLE_SELECTED";
export const SET_GROUPS = "SET_GROUPS";
export const DELETE_MEMBER = "DELETE_MEMBER";
export const ADD_MEMBER = "ADD_MEMBER";
export const getGroups = () => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection(`/Groups/`)
        .where("membersIds", "array-contains", firebase.auth().currentUser.uid)
        .get()
        .then(function (querySnapshot) {
          const groups = [];
          querySnapshot.forEach(function (doc) {
            const docData = doc.data();
            const group = new Group({ id: doc.id, ...docData });

            groups.push(group);
          });

          dispatch({ type: SET_GROUPS, groups: groups });
          resolve();
        });
    });
  };
};
export const addMember = (member) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("RegisteredUsers/")
        .add({ name: member.name, email: member.email })
        .then((docRef) => {
          member.id = docRef.id;
          resolve(member);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };
};
export const deleteMember = (memberId) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .doc(`/RegisteredUsers/${memberId}`)
        .delete()
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };
};
export const createGroup = (group) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const groupToSave = {
        ...group,
        members: group.members.map((member) => {
          return { ...member, balance: member.balance.value };
        }),
      };
      firebase
        .firestore()
        .collection(`Groups/`)
        .add(groupToSave)
        .then((docRef) => {
          group.id = docRef.id;
          dispatch({
            type: CREATE_GROUP,
            group: { ...group },
          });
          resolve(group);
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    });
  };
};
export const updateGroup = (group, id) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      const groupToSave = {
        ...group,
        members: group.members.map((member) => {
          return { ...member, balance: member.balance.value };
        }),
      };
      firebase
        .firestore()
        .doc(`/Groups/${id}`)
        .update(groupToSave)
        .then(() => {
          dispatch({
            type: UPDATE_GROUP,
            groupId: id,
            group: group,
          });
          resolve();
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    });
  };
};
export const deleteGroup = (id, group) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      const members = [...group.members];
      members.forEach((member) => {
        if (member.email === "") {
          firebase
            .firestore()
            .doc(`/RegisteredUsers/${member.id}`)
            .delete()
            .catch((error) => {
              console.log(error);
              reject();
            });
        }
      });
      firebase
        .firestore()
        .doc(`/Groups/${id}`)
        .delete()
        .then(() => {
          dispatch({
            type: DELETE_GROUP,
            groupId: id,
          });
          resolve();
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    });
  };
};
export const toggleSelected = (id) => {
  return {
    type: TOGGLE_SELECTED,
    groupId: id,
  };
};
