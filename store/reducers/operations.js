import {
  CREATE_OPERATION,
  DELETE_GROUP_OPERATIONS,
  DELETE_MEMBER,
  DELETE_OPERATION,
  UPDATE_OPERATION,
} from "../actions/operations";
import * as Currencies from "../../models/Currency";
import lodashCloneDeep from "lodash.clonedeep";
const initialState = {
  operations: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_OPERATION: {
      const operations = state.operations;
      operations.push(action.operation);
      return { ...state, operations: operations };
    }
    case DELETE_MEMBER:
      const filteredOperations = state.operations.map((obj) => {
        if (obj.groupId === action.groupId) {
          const filteredRecipents = obj.recipents.filter(
            (recipent) => recipent.id !== action.memberId
          );
          if (action.memberId === obj.payer.id) {
            obj.payer = { id: filteredRecipents[1].id };
          }
          return { ...obj, recipents: filteredRecipents };
        } else return obj;
      });

      return { ...state, operations: filteredOperations };
    case UPDATE_OPERATION: {
      const operations = state.operations;
      const index = operations.findIndex((obj) => {
        return obj.operationId === action.operationId;
      });

      if (index !== -1) {
        operations[index] = { ...action.operation };
        return { ...state, operations: operations };
      } else {
        return state;
      }
    }
    case DELETE_OPERATION: {
      const operations = [...state.operations];

      const index = operations.findIndex(
        (obj) => obj.operationId === action.operationId
      );
      if (index !== -1) {
        operations.splice(index, 1);
      }

      return { ...state, operations: [...operations] };
    }
    case DELETE_GROUP_OPERATIONS: {
      const groupId = action.groupId;
      const operations = [...state.operations].filter(
        (obj) => obj.groupId !== groupId
      );
      return { ...state, operations: operations };
    }
    default:
      return state;
  }
};
