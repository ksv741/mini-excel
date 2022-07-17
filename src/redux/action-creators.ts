import { ResizeReturnDataType } from 'components/table/handlers/table.resize';
import { ActionType } from 'redux/types';
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

export function tableResize(resizeData: ResizeReturnDataType): ActionType {
  return {
    type: TABLE_RESIZE,
    resizeData,
  };
}

export function changeText(data: { text: string, id: string }): ActionType {
  return {
    type: CHANGE_TEXT,
    data,
  };
}

export function changeCurrentStyles(data: Partial<CSSStyleDeclaration>): ActionType {
  return {
    type: CHANGE_STYLES,
    data,
  };
}

export function applyStyle(data: { ids: (string | undefined)[], value: Partial<CSSStyleDeclaration> }): ActionType {
  return {
    type: APPLY_STYLES,
    data,
  };
}

export function changeTitle(data: string): ActionType {
  return {
    type: CHANGE_TITLE,
    data,
  };
}

export function deleteTable(data: string): ActionType {
  return {
    type: DELETE_TABLE,
    data,
  };
}

export function updateOpenDate(data: string): ActionType {
  return {
    type: UPDATE_DATE,
    data,
  };
}

export function changeCurrentText(data: string): ActionType {
  return {
    type: CHANGE_CURRENT_TEXT,
    data,
  };
}

export function changeTableSize(data: { col: number, row: number }): ActionType {
  return {
    type: CHANGE_TABLE_SIZE,
    data,
  };
}

export function addRow(data: { position: 'after' | 'before', targetIndex: number }): ActionType {
  return {
    type: ADD_ROW_TO_TABLE,
    data,
  };
}

export function addCol(data: { position: 'after' | 'before', targetIndex: number }): ActionType {
  return {
    type: ADD_COL_TO_TABLE,
    data,
  };
}

export function removeRowFromTable(removedRowNumber: number) {
  return {
    type: REMOVE_ROW_FROM_TABLE,
    data: removedRowNumber,
  };
}

export function removeColFromTable(removedColNumber: number) {
  return {
    type: REMOVE_COL_FROM_TABLE,
    data: removedColNumber,
  };
}
