import { ActionType, StateType } from 'redux/types';
import { ActiveRoute } from 'core/routes/ActiveRoute';
import { storageName } from 'pages/ExcelPage';
import {
  CHANGE_TEXT,
  CHANGE_STYLES,
  TABLE_RESIZE,
  APPLY_STYLES,
  CHANGE_TITLE,
  DELETE_TABLE,
  UPDATE_DATE,
} from 'redux/constants';

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
      const fieldName = action.data.id;

      newState[fieldName] = action.data.text;

      return { ...state, currentText: action?.data?.text, dataState: newState };
    }

    case CHANGE_STYLES: {
      return { ...state, currentStyles: action.data };
    }

    case APPLY_STYLES: {
      const fieldName = 'stylesState';
      const val = this.state[fieldName] || {};

      action.data.ids.forEach((id: string) => {
        val[id] = { ...val[id], ...action.data.value };
      });

      return {
        ...state,
        [fieldName]: val,
        currentStyles: { ...state.currentStyles, ...action.data.value },
      };
    }

    case CHANGE_TITLE: {
      return { ...state, title: action.data };
    }

    case DELETE_TABLE: {
      const name = storageName(action.data);
      localStorage.removeItem(name);
      ActiveRoute.navigateTo = '';

      return null;
    }

    case UPDATE_DATE: {
      return { ...this.state, openDate: action.data };
    }

    default: return state;
  }
}
