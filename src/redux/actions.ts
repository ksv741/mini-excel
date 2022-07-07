import { ActionType } from 'redux/types';
import {
  CHANGE_TEXT,
  CHANGE_STYLES,
  TABLE_RESIZE,
  APPLY_STYLES,
  CHANGE_TITLE,
  DELETE_TABLE,
  UPDATE_DATE,
} from './constants';

export function tableResize(resizeData: any) {
  return {
    type: TABLE_RESIZE,
    ...resizeData,
  };
}

export function changeText(data: { text: string, id: string }) {
  return {
    type: CHANGE_TEXT,
    data,
  };
}

export function changeCurrentStyles(data: any) {
  return {
    type: CHANGE_STYLES,
    data,
  };
}

export function applyStyle(data: any) {
  return {
    type: APPLY_STYLES,
    data,
  };
}

export function changeTitle(data: string) {
  return {
    type: CHANGE_TITLE,
    data,
  };
}

export function deleteTable(data: string) {
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
