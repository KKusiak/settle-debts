import { useDispatch } from "react-redux";
import {
  CREATE_GROUP,
  UPDATE_GROUP,
  DELETE_GROUP,
  TOGGLE_SELECTED,
  DELETE_MEMBER,
  UPDATE_BALANCE,
  SET_GROUPS,
} from "../actions/groups";
import * as Currencies from "../../models/Currency";
import { render } from "react-dom";
const initialState = {
  groups: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_GROUPS: {
      return { ...state, groups: [...action.groups] };
    }
    case CREATE_GROUP:
      const { group } = action;
      if (group.title.length !== 0 && group.title !== undefined) {
        const updatedGroupsList = [...state.groups];
        updatedGroupsList.push(group);
        return { ...state, groups: updatedGroupsList };
      } else {
        return state;
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
