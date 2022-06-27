import { $ } from '../../core/dom';

export function isCell(event: Event): boolean {
  return $(event.target as HTMLElement).data.type === 'cell';
}

export function getParamsFromCellId(cellId: string) {
  const row = +cellId.split(':')[0];
  const col = +cellId.split(':')[1];

  return { col, row };
}
