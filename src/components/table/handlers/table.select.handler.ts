import { $ } from '../../../core/dom';
import { isCell } from '../table.functions';
import { TableSelection } from '../TableSelection';

export function selectHandler(event: MouseEvent, selection: TableSelection) {
  if (isCell(event)) {
    if (event.shiftKey) selection.selectGroup($(event.target as HTMLElement));
    else selection.select($(event.target as HTMLElement));
  }
}
