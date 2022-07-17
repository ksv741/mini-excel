import { ToolbarStateType } from 'components/toolbar/toolbar-types';

export type ActionType = {
  type: string
  [k: string]: any
};

export type TableSizeType = {
  col: number;
  row: number;
};

export type StateType = {
  colState: { [k: number]: number };
  rowState: { [k: number]: number };
  currentStyles: ToolbarStateType;
  dataState: { [k: string]: string };
  id: string;
  openDate: number;
  stylesState: { [k: string]: ToolbarStateType };
  title: string;
  currentText: string;
  tableSize: TableSizeType;
};

export type ReducerType = (state: StateType, action: ActionType) => StateType | null;

export type SubscribeType = {
  unsubscribe: () => void
};

export type CallbackType = (...args: any[]) => void;
