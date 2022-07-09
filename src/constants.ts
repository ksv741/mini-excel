import { StateType } from 'redux/types';
import { storage } from 'core/utils';

export const initialStyleState: Partial<CSSStyleDeclaration> = {
  textAlign: 'left',
  fontWeight: 'normal',
  textDecoration: 'none',
  fontStyle: 'normal',
};

export function getNormalizeInitialState(params: string): StateType {
  return {
    colState: {},
    rowState: {},
    dataState: {},
    currentText: '',
    stylesState: {},
    title: 'New excel table',
    ...storage(`excel:${params}`),
    currentStyles: { ...storage(`excel:${params}`)?.stylesState?.['0:0'] },
    id: params,
    openDate: Date.now(),
  };
}
