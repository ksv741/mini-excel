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
    const target = $(event.target as HTMLElement);

    if (isCell(event)) {
      if (event.shiftKey) selection.selectTo(target);
      else if (event.ctrlKey) selection.addCellToSelection(target);
      else selection.select(target);
    } else {
      const row = target.closest('[data-header="row"]');
      const col = target.closest('[data-header="col"]');
      const resizer = target.closest('[data-resizer]');

      if (row.$el && !resizer.$el) {
        const cells = row.closest('[data-row]').findAll('[data-type="cell"]');
        const $cells = Array.from(cells).map(cell => $(cell as HTMLElement));

        selection.selectGroupies($cells);
      } else if (col.$el && !resizer.$el) {
        const colNumber = col.data.col;
        const colls = selection.rootTable.findAll(`[data-col="${colNumber}"]`);
        const $cells = Array.from(colls).filter(el => el !== col.$el).map(el => $(el as HTMLElement));

        selection.selectGroupies($cells);
      }
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
