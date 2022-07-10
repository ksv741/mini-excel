import { $ } from 'core/Dom';
import { TableSelection } from 'components/table/TableSelection';
import { getParamsFromCellId, isCell, startCellId } from 'components/table/table.functions';

export function selectHandler(event: MouseEvent | KeyboardEvent, selection: TableSelection, callback?: () => void) {
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

  // Analog callback && callback();
  callback?.();

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

    // If something goes wrong, go to start line
    const currentCellId = selection.current.data.id || startCellId;
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

        if (event.shiftKey) col--;
        else col++;

        break;
      }
      default: break;
    }

    selection.selectByCellId({ row, col });
  }
}
