import { startCellId } from 'components/table/table.functions';
import { ToolbarStateType } from 'components/toolbar/toolbar-types';
import { storageName } from 'pages/ExcelPage';
import { StateType } from 'redux/types';
import { storage } from 'core/utils';

export const initialStyleState: ToolbarStateType = {
  justifyContent: 'start',
  fontWeight: 'normal',
  textDecoration: 'none',
  fontStyle: 'normal',
  fontSize: '12px',
  fontFamily: 'Roboto',
  alignItems: 'start',
};

export const initialState: StateType = {
  colState: {},
  rowState: {},
  dataState: {},
  stylesState: {},
  title: 'New excel table',
  openDate: Date.now(),
  currentStyles: initialStyleState,
  currentText: 'huy',
};

export function getNormalizeInitialState(params: string): StateType {
  const state = storage(storageName(params));
  if (!state) return initialState;

  return {
    ...state,
    id: params,
    currentStyles: state?.stylesState?.[startCellId] || initialStyleState,
    currentText: state?.dataState?.[startCellId],
  };
}
