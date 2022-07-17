import { ToolbarStateType } from 'components/toolbar/toolbar-types';
import { storageName } from 'core/utils';
import { ActionType, StateType } from 'redux/types';
import { ActiveRoute } from 'core/routes/ActiveRoute';
import {
  CHANGE_TEXT,
  CHANGE_STYLES,
  TABLE_RESIZE,
  APPLY_STYLES,
  CHANGE_TITLE,
  DELETE_TABLE,
  UPDATE_DATE,
  CHANGE_CURRENT_TEXT,
  CHANGE_TABLE_SIZE,
  REMOVE_ROW_FROM_TABLE,
  ADD_ROW_TO_TABLE,
  ADD_COL_TO_TABLE,
  REMOVE_COL_FROM_TABLE,
} from 'redux/action-constants';

export function rootReducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case TABLE_RESIZE: {
      const newState: StateType = { ...state };
      const fieldName = `${action.resizeData?.type}State`;

      newState[fieldName as 'colState' | 'rowState'][action.resizeData?.id] = action.resizeData?.value;

      return { ...state, ...newState };
    }

    case CHANGE_TEXT: {
      const newState: { [k: string]: string } = state.dataState || {};
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

      return null as any;
    }

    case UPDATE_DATE: {
      return { ...state, openDate: action.data };
    }

    case CHANGE_CURRENT_TEXT: {
      return { ...state, currentText: action.data };
    }

    case CHANGE_TABLE_SIZE: {
      return { ...state, tableSize: action.data };
    }

    case ADD_ROW_TO_TABLE: {
      // needs to be redefined next params:
      // rowState: { [k: number]: number };
      // dataState: { [k: string]: string };
      // stylesState: { [k: string]: ToolbarStateType };
      // tableSize: { col: number, row: number }
      const newRowStateEntries: [number, number][] = [];
      const newDataStateEntries: [string, string][] = [];
      const newStylesStateEntries: [string, ToolbarStateType][] = [];
      // rowState change
      Object.entries(state.rowState).forEach(([key, value]) => {
        switch (true) {
          case action.data.position === 'before' && +key < action.data.targetIndex:
          case action.data.position === 'after' && +key <= action.data.targetIndex:
            newRowStateEntries.push([+key, value]);
            break;

          case action.data.position === 'before' && +key >= action.data.targetIndex:
          case action.data.position === 'after' && +key > action.data.targetIndex:
            newRowStateEntries.push([+key + 1, value]);
            break;

          default: break;
        }
      });
      const newRowState = Object.fromEntries(newRowStateEntries);
      // dataState change
      Object.entries(state.dataState).forEach(([key, value]) => {
        const [row, col] = key.split(':');
        switch (true) {
          case action.data.position === 'before' && +row < action.data.targetIndex:
          case action.data.position === 'after' && +row <= action.data.targetIndex:
            newDataStateEntries.push([key, value.toString()]);
            break;

          case action.data.position === 'before' && +row >= action.data.targetIndex:
          case action.data.position === 'after' && +row > action.data.targetIndex:
            newDataStateEntries.push([`${+row + 1}:${col}`, value.toString()]);
            break;

          default: break;
        }
      });
      const newDataState = Object.fromEntries(newDataStateEntries);
      // stylesState change
      Object.entries(state.stylesState).forEach(([key, value]) => {
        const [row, col] = key.split(':');
        switch (true) {
          case action.data.position === 'before' && +row < action.data.targetIndex:
          case action.data.position === 'after' && +row <= action.data.targetIndex:
            newStylesStateEntries.push([key, value]);
            break;

          case action.data.position === 'before' && +row >= action.data.targetIndex:
          case action.data.position === 'after' && +row > action.data.targetIndex:
            newStylesStateEntries.push([`${+row + 1}:${col}`, value]);
            break;

          default: break;
        }
      });
      const newStylesState = Object.fromEntries(newStylesStateEntries);
      // tableSize
      const newTableSize = { col: state.tableSize.col, row: state.tableSize.row + 1 };
      // debugger
      return { ...state, rowState: newRowState, dataState: newDataState, stylesState: newStylesState, tableSize: newTableSize };
    }

    case ADD_COL_TO_TABLE: {
      // needs to be redefined next params:
      // colState: { [k: number]: number };
      // dataState: { [k: string]: string };
      // stylesState: { [k: string]: ToolbarStateType };
      // tableSize: { col: number, row: number }
      const newColStateEntries: [number, number][] = [];
      const newDataStateEntries: [string, string][] = [];
      const newStylesStateEntries: [string, ToolbarStateType][] = [];
      // colState change
      Object.entries(state.colState).forEach(([key, value]) => {
        switch (true) {
          case action.data.position === 'before' && +key < action.data.targetIndex:
          case action.data.position === 'after' && +key <= action.data.targetIndex:
            newColStateEntries.push([+key, value]);
            break;

          case action.data.position === 'before' && +key >= action.data.targetIndex:
          case action.data.position === 'after' && +key > action.data.targetIndex:
            newColStateEntries.push([+key + 1, value]);
            break;

          default: break;
        }
      });
      const newColState = Object.fromEntries(newColStateEntries);
      // dataState change
      Object.entries(state.dataState).forEach(([key, value]) => {
        const [row, col] = key.split(':');
        switch (true) {
          case action.data.position === 'before' && +col < action.data.targetIndex:
          case action.data.position === 'after' && +col <= action.data.targetIndex:
            newDataStateEntries.push([key, value.toString()]);
            break;

          case action.data.position === 'before' && +col >= action.data.targetIndex:
          case action.data.position === 'after' && +col > action.data.targetIndex:
            newDataStateEntries.push([`${row}:${+col + 1}`, value.toString()]);
            break;

          default: break;
        }
      });
      const newDataState = Object.fromEntries(newDataStateEntries);
      // stylesState change
      Object.entries(state.stylesState).forEach(([key, value]) => {
        const [row, col] = key.split(':');
        switch (true) {
          case action.data.position === 'before' && +col < action.data.targetIndex:
          case action.data.position === 'after' && +col <= action.data.targetIndex:
            newStylesStateEntries.push([key, value]);
            break;

          case action.data.position === 'before' && +col >= action.data.targetIndex:
          case action.data.position === 'after' && +col > action.data.targetIndex:
            newStylesStateEntries.push([`${row}:${+col + 1}`, value]);
            break;

          default: break;
        }
      });
      const newStylesState = Object.fromEntries(newStylesStateEntries);
      // tableSize
      const newTableSize = { col: state.tableSize.col + 1, row: state.tableSize.row };
      // debugger
      return { ...state, colState: newColState, dataState: newDataState, stylesState: newStylesState, tableSize: newTableSize };
    }

    case REMOVE_ROW_FROM_TABLE: {
      // needs to be redefined next params:
      // rowState: { [k: number]: number };
      // dataState: { [k: string]: string };
      // stylesState: { [k: string]: ToolbarStateType };
      // tableSize: { col: number, row: number }

      const newRowStateEntries: [number, number][] = [];
      const newDataStateEntries: [string, string][] = [];
      const newStylesStateEntries: [string, ToolbarStateType][] = [];
      // rowState change
      Object.entries(state.rowState).forEach(([key, value]) => {
        switch (true) {
          case key < action.data:
            newRowStateEntries.push([+key, value]);
            break;

          case key > action.data:
            newRowStateEntries.push([+key - 1, value]);
            break;

          default: break;
        }
      });
      const newRowState = Object.fromEntries(newRowStateEntries);
      // dataState change
      Object.entries(state.dataState).forEach(([key, value]) => {
        const [row, col] = key.split(':');
        switch (true) {
          case row < action.data:
            newDataStateEntries.push([key, value.toString()]);
            break;

          case row > action.data:
            newDataStateEntries.push([`${+row - 1}:${col}`, value.toString()]);
            break;

          default: break;
        }
      });
      const newDataState = Object.fromEntries(newDataStateEntries);
      // stylesState change
      Object.entries(state.stylesState).forEach(([key, value]) => {
        const [row, col] = key.split(':');
        switch (true) {
          case row < action.data:
            newStylesStateEntries.push([key, value]);
            break;

          case row > action.data:
            newStylesStateEntries.push([`${+row - 1}:${col}`, value]);
            break;

          default: break;
        }
      });
      const newStylesState = Object.fromEntries(newStylesStateEntries);
      // tableSize
      const newTableSize = { col: state.tableSize.col, row: state.tableSize.row - 1 };

      return { ...state, rowState: newRowState, dataState: newDataState, stylesState: newStylesState, tableSize: newTableSize };
    }

    case REMOVE_COL_FROM_TABLE: {
      // needs to be redefined next params:
      // colState: { [k: number]: number };
      // dataState: { [k: string]: string };
      // stylesState: { [k: string]: ToolbarStateType };
      // tableSize: { col: number, row: number }

      const newColStateEntries: [number, number][] = [];
      const newDataStateEntries: [string, string][] = [];
      const newStylesStateEntries: [string, ToolbarStateType][] = [];
      // colState change
      Object.entries(state.colState).forEach(([key, value]) => {
        switch (true) {
          case key < action.data:
            newColStateEntries.push([+key, value]);
            break;

          case key > action.data:
            newColStateEntries.push([+key - 1, value]);
            break;

          default: break;
        }
      });
      const newColState = Object.fromEntries(newColStateEntries);
      // dataState change
      Object.entries(state.dataState).forEach(([key, value]) => {
        const [row, col] = key.split(':');
        switch (true) {
          case col < action.data:
            newDataStateEntries.push([key, value.toString()]);
            break;

          case col > action.data:
            newDataStateEntries.push([`${row}:${+col - 1}`, value.toString()]);
            break;

          default: break;
        }
      });
      const newDataState = Object.fromEntries(newDataStateEntries);
      // stylesState change
      Object.entries(state.stylesState).forEach(([key, value]) => {
        const [row, col] = key.split(':');
        switch (true) {
          case col < action.data:
            newStylesStateEntries.push([key, value]);
            break;

          case col > action.data:
            newStylesStateEntries.push([`${row}:${+col - 1}`, value]);
            break;

          default: break;
        }
      });
      const newStylesState = Object.fromEntries(newStylesStateEntries);
      // tableSize
      const newTableSize = { col: state.tableSize.col - 1, row: state.tableSize.row };

      return { ...state, colState: newColState, dataState: newDataState, stylesState: newStylesState, tableSize: newTableSize };
    }

    default: return state;
  }
}
