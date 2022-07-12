import { $ } from 'core/Dom';

export function isCell(event: Event): boolean {
  return $(event.target).data.type === 'cell';
}

export function getParamsFromCellId(cellId: string) {
  const row = +cellId.split(':')[0];
  const col = +cellId.split(':')[1];

  return { col, row };
}

export const startCellId = '0:0';
