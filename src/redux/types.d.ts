import { ToolbarStateType } from 'components/toolbar/toolbar-types';

export type ActionType = {
  type: string
  [k: string]: any
};

export type StateType = {
  colState: { [k: number]: number };
  rowState: { [k: number]: number };
  currentStyles: ToolbarStateType;
  dataState: { [k: string]: string };
  id: string;
  openDate: string;
  stylesState: { [k: string]: ToolbarStateType };
  title: string;
  currentText: string;
};

export type ReducerType = (state: StateType, action: ActionType) => StateType;

export type SubscribeType = {
  unsubscribe: () => void
};
