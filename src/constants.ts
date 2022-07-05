import { storage } from './core/utils';
import { StateType } from './redux/types';

export const initialStyleState: Partial<CSSStyleDeclaration> = {
  textAlign: 'left',
  fontWeight: 'normal',
  textDecoration: 'none',
  fontStyle: 'normal',
};

export const initialState: StateType = {
  colState: {},
  rowState: {},
  dataState: {},
  currentText: '',
  stylesState: {},
  title: 'New excel table',
  ...storage('excel-state'),
  currentStyles: { ...storage('excel-state')?.stylesState?.['0:0'] },
};
