import { $ } from '../../core/dom';

export function isCell(event: Event): boolean {
  return $(event.target as HTMLElement).data.type === 'cell';
}
