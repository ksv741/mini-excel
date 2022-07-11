import { startCellId } from 'components/table/table.functions';
import { ToolbarStateType } from 'components/toolbar/toolbar-types';
import { storageName } from 'pages/ExcelPage';
import { StateType } from 'redux/types';
import { storage } from 'core/utils';

export const fontSizes = [
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '22px',
  '24px',
  '26px',
  '28px',
  '30px',
];
export const fontFamilies = ['Roboto', 'Cormorant SC', 'Kanit', 'Playfair Display'];

export const initialStyleState: ToolbarStateType = {
  justifyContent: 'start',
  fontWeight: 'normal',
  textDecoration: 'none',
  fontStyle: 'normal',
  fontSize: fontSizes[0],
  fontFamily: fontFamilies[0],
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
