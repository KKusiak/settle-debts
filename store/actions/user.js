export const CREATE_USER = "CREATE_USER";
export const UPDATE_USER = "UPDATE_USER";
export const DELETE_USER = "DELETE_USER";

export const TOGGLE_SELECTED = "TOGGLE_SELECTED";

export const createGroup = (group) => {
  return {
    type: CREATE_GROUP,
    group: group,
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
