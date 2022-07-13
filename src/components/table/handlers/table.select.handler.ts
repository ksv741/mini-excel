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

    case 'mouseover': {
      onMouseOverHandler();
      break;
    }

    default: break;
  }

  // Analog callback && callback();
  callback?.();

  function onMouseDownHandler() {
    const target = $(event.target);

    if (isCell(event)) {
      if (event.shiftKey) selection.selectFromTo(selection.$currentCell, target);
      else if (event.ctrlKey) selection.addCellToSelection(target);
      else selection.select(target);
    } else {
      const row = target.closest('[data-header="row"]');
      const col = target.closest('[data-header="col"]');
      const resizer = target.closest('[data-resize]');

      if (row.$el && !resizer.$el) {
        const cells = row.closest('[data-row]').findAll('[data-type="cell"]');
        const $cells = Array.from(cells).map(cell => $(cell as HTMLElement));

        selection.selectGroupies($cells);
      } else if (col.$el && !resizer.$el) {
        const colNumber = col.data.col;
        const columns = selection.rootTable.$root.findAll(`[data-col="${colNumber}"]`);
        const $cells = Array.from(columns).filter(el => el !== col.$el).map(el => $(el as HTMLElement));

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

    if (!selection?.$currentCell || !handleKeys.includes(key)) return;

    // If something goes wrong, go to start line
    const currentCellId = selection.$currentCell.data.id || startCellId;
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
        if (row === selection.rootTable.tableSize.row) selection.rootTable.addNewRowHandler();
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

    if (event.shiftKey) selection.addGroupToSelectionById({ row, col });
    else selection.selectByCellId({ row, col });
  }

  function onMouseOverHandler() {
    if (selection.$currentCell.$el) {
      // TODO find event type
      selection.selectFromTo(selection.$currentCell, $((event as any).toElement));
    }
  }
}
