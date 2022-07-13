import { Table } from 'components/table/Table';
import { $, Dom } from 'core/Dom';
import { getParamsFromCellId, startCellId } from 'components/table/table.functions';

export class TableSelection {
  static selectedClassName = 'selected';
  private selectedCellsGroup: Dom[];
  // TODO remove focus, when selection
  // $focusedCell and $currentCell can be different, f.e. if select cells with Shift key, currentCell
  // will be last cell, focusedCell will start cell, and can be different from selectedCellsGroup first item
  public $currentCell: Dom;
  public $focusedCell: Dom;
  public rootTable: Table;

  constructor(rootTable: Table) {
    this.selectedCellsGroup = [];
    this.rootTable = rootTable;
  }

  get selectedIds() {
    return this.selectedCellsGroup.map(el => el.data.id);
  }

  // TODO make a focus manager
  focusToCell($cell: Dom) {
    try {
      const range = new Range();
      const node = $cell.$el;

      range.setStartAfter(node.childNodes[0]);

      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
    } catch (e) {
      console.log('Error focus', e.message);
    }
  }

  select($cell: Dom) {
    this.clearSelection();
    this.selectedCellsGroup = [$cell];
    this.$currentCell = $cell;
    $cell.addClass(TableSelection.selectedClassName);
    this.focusToCell($cell);
    this.selectHeader($cell);
    this.$focusedCell = $cell;
  }

  selectByCellId(cellID: { col: number, row: number }) {
    let { col, row } = cellID;

    if (col <= 0) col = 0;
    if (row <= 0) row = 0;

    this.select($(`[data-id="${row}:${col}"]`));
  }

  clearSelection() {
    this.selectedCellsGroup.forEach(el => el?.removeClass(TableSelection.selectedClassName));
    this.$currentCell?.removeClass(TableSelection.selectedClassName);
    this.clearHeaderSelection();
    this.selectedCellsGroup = [];
  }

  selectFromTo($from: Dom, $cell: Dom) {
    const startCellParams = getParamsFromCellId($from.data.id || startCellId);
    const selectedCellParams = getParamsFromCellId($cell.data.id || startCellId);

    const startCol = Math.min(startCellParams.col, selectedCellParams.col);
    const endCol = Math.max(startCellParams.col, selectedCellParams.col);
    const startRow = Math.min(startCellParams.row, selectedCellParams.row);
    const endRow = Math.max(startCellParams.row, selectedCellParams.row);

    this.clearSelection();

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const $target = $(`[data-id="${row}:${col}"]`);
        this.addCellToSelection($target);
      }
    }
  }

  selectGroupies($cells: Dom[]) {
    this.clearSelection();
    $cells.forEach($cell => this.addCellToSelection($cell));
  }

  addCellToSelection($cell: Dom) {
    this.selectedCellsGroup.push($cell);
    $cell.addClass(TableSelection.selectedClassName);
    this.selectHeader($cell);
  }

  addGroupToSelectionById(cellID: { col: number, row: number }) {
    if (this.selectedCellsGroup.length === 1) {
      this.$focusedCell = this.selectedCellsGroup[0];
    }
    const { col, row } = cellID;
    const $cell = $(`[data-id="${row}:${col}"]`);
    const $lastCell = this.selectedCellsGroup[this.selectedCellsGroup.length - 1];

    if (!$lastCell.isExist) {
      this.select($lastCell);
      return;
    }

    this.selectFromTo(this.$focusedCell, $cell);

    this.$currentCell = $cell;
  }

  applyStyle(style: CSSStyleDeclaration) {
    this.selectedCellsGroup.forEach(el => el.css(style));
  }

  selectHeader($cell: Dom) {
    if (!$cell) return;

    const { headerCol, headerRow } = this.findHeadOfCell($cell);

    headerRow.addClass(TableSelection.selectedClassName);
    headerCol.addClass(TableSelection.selectedClassName);
  }

  clearHeaderSelection() {
    this.rootTable.$root.findAll('[data-header]').forEach(header => {
      header.classList.remove(TableSelection.selectedClassName);
    });
  }

  findHeadOfCell($cell: Dom): { headerRow: Dom, headerCol: Dom } {
    const headerRow = $cell.closest('[data-row]').find("[data-header='row']");
    const headerCol = this.rootTable.$root.find(`[data-col="${$cell.data.id?.split(':')[1]}"]`);

    return { headerRow, headerCol };
  }

  isCellInSelection($cell: Dom) {
    return this.selectedCellsGroup.includes($cell);
  }
}
