import { startCellId } from 'components/table/table.functions';
import { ToolbarStateType } from 'components/toolbar/toolbar-types';
import { StateType } from 'redux/types';
import { storage } from 'core/utils';

export const initialStyleState: ToolbarStateType = {
  justifyContent: 'start',
  fontWeight: 'normal',
  textDecoration: 'none',
  fontStyle: 'normal',
  fontSize: '12px',
};

export function getNormalizeInitialState(params: string): StateType {
  return {
    colState: {},
    rowState: {},
    dataState: {},
    stylesState: {},
    title: 'New excel table',
    id: params,
    openDate: Date.now(),
    ...storage(`excel:${params}`),
    currentStyles: { ...storage(`excel:${params}`)?.stylesState?.[startCellId] },
    currentText: { ...storage(`excel:${params}`)?.dataState?.[startCellId] },
  };
}
