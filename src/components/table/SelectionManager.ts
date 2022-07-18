import { Table } from 'components/table/Table';
import {
  getCellIdFromParams,
  getParamsFromCellId,
  isCell2,
  isSelectionKey,
  startCellId,
} from 'components/table/table.functions';
import { $, Dom } from 'core/Dom';
import { getCellById, getIdByCell } from 'core/utils';

export class SelectionManager {
  private rootTable: Table;
  private $selection: Dom[];
  public $currentSelectedCell: Dom | null;
  private $firstSelectedCell: Dom | null;

  private isMouseDowned: boolean;
  private static selectedClassName = 'selected';

  private static addSelectedCellClass($cell: Dom) {
    if (!$cell || !$cell.isExist) return;
    $cell.addClass('selected');
  }

  private static removeSelectedCellClass($cell: Dom) {
    if (!$cell || !$cell.isExist) return;
    $cell.removeClass('selected');
  }

  private addCurrentCellClass() {
    if (!this.$firstSelectedCell?.isExist) this.$currentSelectedCell?.addClass('current');
    else this.$firstSelectedCell?.addClass('current');
  }

  private removeCurrentCellClass() {
    if (!this.$firstSelectedCell?.isExist) this.$currentSelectedCell?.removeClass('current');
    else this.$firstSelectedCell?.removeClass('current');
  }

  public static selectionKeys = [
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'Enter',
    'Tab',
    'Delete',

    'Control',
    'Shift',
  ];

  constructor(rootTable: Table) {
    this.rootTable = rootTable;

    this.initManager();
  }

  private initManager() {
    this.clearAllSelection();

    this.isMouseDowned = false;
  }

  get selectedIds() {
    return this.$selection.map($cell => getCellIdFromParams(getIdByCell($cell)));
  }

  addCellToSelection($target: Dom) {
    this.$selection.push($target);
    this.currentSelectedCell = $target;
    this.selectHeader($target);

    SelectionManager.addSelectedCellClass($target);
  }

  private set currentSelectedCell($cell: Dom | null) {
    this.removeCurrentCellClass();
    if ($cell) {
      this.$currentSelectedCell = $cell;
      this.addCurrentCellClass();
    }
  }

  selectFromTo($from: Dom, $cell: Dom) {
    this.clearAllSelection(false);

    const startCellParams = getParamsFromCellId($from.data.id || startCellId);
    const selectedCellParams = getParamsFromCellId($cell.data.id || startCellId);

    const startCol = Math.min(startCellParams.col, selectedCellParams.col);
    const endCol = Math.max(startCellParams.col, selectedCellParams.col);
    const startRow = Math.min(startCellParams.row, selectedCellParams.row);
    const endRow = Math.max(startCellParams.row, selectedCellParams.row);

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const $target = $(`[data-id="${row}:${col}"]`);
        this.addCellToSelection($target);
      }
    }

    this.rootTable.focusManager.focusOnTable();
  }

  selectCell($cell: Dom) {
    this.clearAllSelection();
    this.rootTable.focusManager.focusOnTable();
    this.$selection = [$cell];
    this.currentSelectedCell = $cell;
    this.$firstSelectedCell = $cell;
    this.selectHeader($cell);

    this.rootTable.emitSelectCallback($cell);

    SelectionManager.addSelectedCellClass($cell);
  }

  selectCells($cells: Dom[]) {
    this.clearAllSelection();
    $cells.forEach($cell => this.addCellToSelection($cell));
  }

  addGroupToSelectionById(cellID: { col: number | string, row: number | string }) {
    if (this.$selection.length === 1) {
      this.$firstSelectedCell = this.$selection[0];
    }

    const { col, row } = cellID;
    const $cell = $(`[data-id="${row}:${col}"]`);
    const $lastCell = this.$selection[this.$selection.length - 1];

    if (!$lastCell.isExist || !this.$firstSelectedCell?.isExist) {
      this.selectCell($lastCell);
      return;
    }

    this.selectFromTo(this.$firstSelectedCell, $cell);

    this.$currentSelectedCell = $cell;
  }

  clearAllSelection(clearFirstSelectedCell = true) {
    this.$selection?.forEach($cell => SelectionManager.removeSelectedCellClass($cell));
    this.$selection = [];
    this.currentSelectedCell = null;
    if (clearFirstSelectedCell) this.$firstSelectedCell = null;
    this.clearHeaderSelection();
    this.rootTable.focusManager?.resetFocus();
  }

  selectHeadRowCol($target: Dom) {
    const row = $target.closest('[data-header="row"]');
    const col = $target.closest('[data-header="col"]');
    const resizer = $target.closest('[data-resize]');

    if (resizer?.isExist) return;

    let $cells: Dom[] = [];
    if (row?.isExist) {
      const cells = row.closest('[data-row]')?.findAll('[data-type="cell"]');
      if (!cells) return;

      $cells = Array.from(cells).map(cell => $(cell as HTMLElement));
    } else if (col?.isExist) {
      const colNumber = col.data.col;
      const columns = this.rootTable.$root.findAll(`[data-col="${colNumber}"]`);

      $cells = Array.from(columns).filter(el => !col.isEqual(el as HTMLElement)).map(el => $(el as HTMLElement));
    }

    this.selectCells($cells);
    this.currentSelectedCell = $cells[0];
    this.$currentSelectedCell?.isExist && this.rootTable.emitSelectCallback(this.$currentSelectedCell);
  }

  selectHeader($cell: Dom) {
    if (!$cell.isExist) return;

    const { headerCol, headerRow } = this.findHeadOfCell($cell);

    headerRow?.addClass(SelectionManager.selectedClassName);
    headerCol?.addClass(SelectionManager.selectedClassName);
  }

  clearHeaderSelection() {
    this.rootTable.$root.findAll('[data-header]').forEach(header => {
      header.classList.remove(SelectionManager.selectedClassName);
    });
  }

  getNeighbourCellBySide(side: 'left' | 'right' | 'down' | 'up', $cell = this.$currentSelectedCell): Dom | undefined {
    if (!$cell?.isExist) {
      console.error('Нет стартовой ячейки');
      return;
    }

    let { row, col } = getIdByCell($cell);
    if (row === undefined || col === undefined) return;

    switch (side) {
      case 'down':
        row++;
        break;

      case 'up':
        row--;
        break;

      case 'left':
        col--;
        break;

      case 'right':
        col++;
        break;

      default: break;
    }

    const $neighbourCell = getCellById({ col, row });
    if (!$neighbourCell || !$neighbourCell.isExist) {
      console.error('Не получилось найти ячейку');
      return;
    }

    // FIXME
    // eslint-disable-next-line consistent-return
    return $neighbourCell;
  }

  // TODO remove
  moveSelectionTo(side: 'left' | 'right' | 'down' | 'up') {
    const $current = this.$currentSelectedCell || this.rootTable.focusManager.$currentFocusedCell || this.$currentSelectedCell?.[0];
    if (!$current?.isExist) return;

    const $movingCell = this.getNeighbourCellBySide(side, $current);
    if (!$movingCell?.isExist || !$movingCell) {
      console.error('Ошибка, не найдена ячейка для перемещения');
      return;
    }
    this.selectCell($movingCell);
  }

  findHeadOfCell($cell: Dom): { headerRow: Dom | undefined, headerCol: Dom | undefined } {
    const headerRow = $cell.closest('[data-row]')?.find("[data-header='row']");
    const headerCol = this.rootTable.$root.find(`[data-col="${$cell.data.id?.split(':')[1]}"]`);

    return { headerRow, headerCol };
  }

  onMouseDownHandler(event: MouseEvent) {
    const target = $(event.target);
    const header = target.closest('[data-header]');
    const resizer = target.closest('[data-resize]');
    event.preventDefault();

    if (header?.isExist && !isCell2(target) && !resizer?.isExist) {
      this.selectHeadRowCol(header);
      return;
    }
    if (!isCell2(target)) return;
    if (this.$currentSelectedCell && target.isEqual(this.$currentSelectedCell)) return;

    this.isMouseDowned = true;

    switch (true) {
      case event.ctrlKey:
        this.addCellToSelection(target);
        break;

      case event.shiftKey:
        if (!this.$currentSelectedCell) this.selectCell(target);
        else {
          const id = getIdByCell(target);
          if (!id) return;
          const { row, col } = id;
          if (row === undefined || col === undefined) return;

          this.addGroupToSelectionById({ row, col });
        }

        break;

      default: this.selectCell(target);
    }
  }

  onKeyDownHandler(event: KeyboardEvent) {
    if (!isSelectionKey(event.key) || this.rootTable.focusManager.$currentFocusedCell?.isExist) {
      // TODO improve check
      if (event.key.length === 1) {
        this.$currentSelectedCell && this.rootTable.focusManager.focusCell(this.$currentSelectedCell);
      }

      return;
    }

    event.preventDefault();

    let $cell: Dom | undefined;
    let side: 'left' | 'right' | 'down' | 'up' = 'right';

    switch (event.key) {
      case 'Shift':
      case 'Control':
        return;

      case 'ArrowDown':
        side = 'down';
        break;

      case 'ArrowUp':
        side = 'up';
        break;

      case 'ArrowLeft':
        side = 'left';
        break;

      case 'ArrowRight':
        side = 'right';
        break;

      case 'Enter':
        side = event.shiftKey ? 'up' : 'down';
        break;

      case 'Tab':
        side = event.shiftKey ? 'left' : 'right';
        break;

      case 'Delete': {
        this.$selection.forEach($el => {
          this.rootTable.updateTextInCell('', $el);
        });
        return;
      }

      default: break;
    }

    if (!side) return;

    // $cell = this.getNeighbourCellBySide(side);
    $cell = this.getNeighbourCellBySide(side, this.$currentSelectedCell || this.$firstSelectedCell);

    if (event.ctrlKey && $cell?.isExist) {
      this.addCellToSelection($cell);
      return;
    }

    if (event.shiftKey && $cell?.isExist && event.key !== 'Enter' && event.key !== 'Tab') {
      const id = getIdByCell($cell);
      if (!id) return;

      const { row, col } = id;
      if (row === undefined || col === undefined) return;

      this.addGroupToSelectionById({ row, col });
      return;
    }

    $cell = this.getNeighbourCellBySide(side, this.$firstSelectedCell || this.$currentSelectedCell);
    if (!$cell || !$cell.isExist) return;

    this.selectCell($cell);
  }

  doubleClickHandler(event: MouseEvent) {
    const target = $(event.target);
    if (!isCell2(target)) return;

    this.rootTable.focusManager.focusCell(target);
    this.rootTable.updateTextInCell(target.dataValue, target, true);
  }

  onMouseOverHandler(event: MouseEvent) {
    if (!this.isMouseDowned) return;
    const $target = $((event as any).toElement);

    if (this.$firstSelectedCell?.isExist && isCell2($target)) {
      this.selectFromTo(this.$firstSelectedCell, $target);
      this.$currentSelectedCell = $target;
    }
  }

  onMouseUpHandler() {
    this.isMouseDowned = false;
  }

  applyStyle(style: Partial<CSSStyleDeclaration>) {
    this.$selection.forEach($cell => {
      $cell.css(style);
    });
  }
}
