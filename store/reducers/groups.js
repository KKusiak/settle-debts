import { useDispatch } from "react-redux";
import {
  CREATE_GROUP,
  UPDATE_GROUP,
  DELETE_GROUP,
  TOGGLE_SELECTED,
  DELETE_MEMBER,
  UPDATE_BALANCE,
  SET_GROUPS,
  ADD_MEMBER,
} from "../actions/groups";
import * as Currencies from "../../models/Currency";
import { render } from "react-dom";
const initialState = {
  groups: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_GROUPS: {
      const updated = [...action.groups];
      return { ...state, groups: updated };
    }
    case CREATE_GROUP: {
      const groups = state.groups;
      groups.push(action.group);
      return { ...state, groups: groups };
    }
    case UPDATE_GROUP: {
      const groups = state.groups;
      const index = groups.findIndex((obj) => {
        return obj.id === action.groupId;
      });

      if (index !== -1) {
        groups[index] = { ...action.group };
        return { ...state, groups: groups };
      } else {
        return state;
      }
    }
    case DELETE_GROUP:
      const groups = state.groups;
      const index = groups.findIndex((obj) => obj.id === action.groupId);
      if (index !== -1) {
        groups.splice(index, 1);
      }
      return { ...state, groups: [...groups] };
    case TOGGLE_SELECTED:
      const updatedGroupsList = state.groups;
      const groupToUpdate = updatedGroupsList.find(
        (group) => group.id === action.groupId
      );
      groupToUpdate.selected = !groupToUpdate.selected;
      return { ...state, groups: updatedGroupsList };

    default:
      return state;
  }
};
