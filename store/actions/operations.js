export const CREATE_OPERATION = "CREATE_OPERATION";
export const UPDATE_OPERATION = "UPDATE_OPERATION";
export const DELETE_OPERATION = "DELETE_OPERATION";
export const DELETE_MEMBER = "DELETE_MEMBER";
export const DELETE_GROUP_OPERATIONS = "DELETE_GROUP_OPERATIONS";
export const createOperation = (operation) => {
  return {
    type: CREATE_OPERATION,
    operation,
  };
};
export const updateOperation = (operationId, operation) => {
  return {
    type: UPDATE_OPERATION,
    operationId,
    operation,
  };
};
export const deleteOperation = (operationId) => {
  return {
    type: DELETE_OPERATION,
    operationId,
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
