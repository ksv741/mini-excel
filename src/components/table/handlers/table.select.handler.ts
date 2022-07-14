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
      'Delete',
    ];

    if (!selection?.$currentCell || !handleKeys.includes(key)) return;

    // If something goes wrong, go to start line
    const currentCellId = selection.$currentCell.data.id || startCellId;
    let { row, col } = getParamsFromCellId(currentCellId);

    switch (key) {
      case 'ArrowDown': {
        if (selection.rootTable.tableSize.row === row + 1) return;
        row++;
        break;
      }
      case 'ArrowUp': {
        row--;
        break;
      }
      case 'ArrowRight': {
        if (selection.rootTable.tableSize.col === col + 1) return;
        col++;
        break;
      }
      case 'ArrowLeft': {
        col--;
        break;
      }
      case 'Enter': {
        event.preventDefault();

        if (event.shiftKey) row--;
        else row++;
        if (row === selection.rootTable.tableSize.row) selection.rootTable.addNewRowHandler();
        break;
      }
      case 'Tab': {
        event.preventDefault();

        // Tab in selection must save focus in inner selection cells
        if (selection.selectedCellsGroup.length > 1) {
          const idxInSelection = selection.selectedCellsGroup.findIndex(el => el.$el === selection.$focusedCell.$el);
          const nextIdx = idxInSelection + 1 === selection.selectedCellsGroup.length ? 0 : idxInSelection + 1;

          selection.focusToCell(selection.selectedCellsGroup[nextIdx]);

          break;
        }

        if (event.shiftKey) col--;
        else col++;

        break;
      }
      case 'Delete': {
        if (selection.selectedCellsGroup.length > 1) {
          event.preventDefault();

          selection.selectedCellsGroup.forEach($cell => selection.rootTable.updateTextInCell('', $cell));
        }

        break;
      }
      default: break;
    }

    if (event.shiftKey && key !== 'Tab' && key !== 'Enter') selection.addGroupToSelectionById({ row, col });
    else selection.selectByCellId({ row, col });
  }

  function onMouseOverHandler() {
    if (selection.$currentCell.$el) {
      // TODO find event type
      selection.selectFromTo(selection.$currentCell, $((event as any).toElement));
    }
  }
}
