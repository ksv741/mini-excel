import { $ } from '../../../core/dom';
import { getParamsFromCellId, isCell } from '../table.functions';
import { TableSelection } from '../TableSelection';

export function selectHandler(event: MouseEvent | KeyboardEvent, selection: TableSelection) {
  switch (event.type) {
    case 'mousedown': {
      onMouseDownHandler();
      break;
    }
    case 'keydown': {
      onKeyDownHandler();
      break;
    }
    default: break;
  }

  function onMouseDownHandler() {
    if (isCell(event)) {
      if (event.shiftKey) selection.selectGroup($(event.target as HTMLElement));
      else selection.select($(event.target as HTMLElement));
    }
  }

  function onKeyDownHandler() {
    const { key } = event as KeyboardEvent;
    const handleKeys = [
      'ArrowDown',
      'ArrowUp',
      'ArrowRight',
      'ArrowLeft',
      'Enter',
      'Tab',
    ];

    if (!selection?.current || !handleKeys.includes(key)) return;

    const currentCellId = selection.current?.data?.id;
    let { row, col } = getParamsFromCellId(currentCellId);

    switch (key) {
      case 'ArrowDown': {
        row++;
        break;
      }
      case 'ArrowUp': {
        row--;
        break;
      }
      case 'ArrowRight': {
        col++;
        break;
      }
      case 'ArrowLeft': {
        col--;
        break;
      }
      case 'Enter': {
        if (event.shiftKey) return;

        event.preventDefault();
        row++;
        break;
      }
      case 'Tab': {
        event.preventDefault();
        col++;
        break;
      }
      default: break;
    }

    selection.selectByCellId({ row, col });
  }
}