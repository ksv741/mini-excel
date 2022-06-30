import { CHANGE_TEXT, TABLE_RESIZE } from './constants';
import { ActionType, StateType } from './types';

export function rootReducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case TABLE_RESIZE: {
      const newState: StateType = { ...state };
      const fieldName = `${action.resizeData?.type}State`;

      newState[fieldName][action.resizeData?.id] = action.resizeData?.value;

      return { ...state, ...newState };
    }

    case CHANGE_TEXT: {
      const newState: StateType = state.dataState || {};

      newState[action.data.id] = action.data.text;

      return { ...state, currentText: action?.data?.text, dataState: newState };
    }

    default: return state;
  }
}
