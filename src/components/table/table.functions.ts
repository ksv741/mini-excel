import { SelectionManager } from 'components/table/SelectionManager';
import { $, Dom } from 'core/Dom';

export function isCell(event: Event): boolean {
  return $(event.target).data.type === 'cell';
}

export function isCell2($cell: Dom): boolean {
  return $cell.data.type === 'cell';
}

export function isSelectionKey(key: string): boolean {
  return SelectionManager.selectionKeys.includes(key);
}

export function getParamsFromCellId(cellId: string) {
  const row = +cellId.split(':')[0];
  const col = +cellId.split(':')[1];

  return { col, row };
}

export function getCellIdFromParams(params: { row?: string, col?: string }) {
  return `${params.row}:${params.col}`;
}

export const startCellId = '0:0';
