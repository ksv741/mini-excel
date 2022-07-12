import { Table } from 'components/table/Table';
import { $, Dom } from 'core/Dom';
import { getParamsFromCellId, startCellId } from 'components/table/table.functions';

export class TableSelection {
  static selectedClassName = 'selected';
  private group: Dom[];
  public current: Dom;
  public rootTable: Table;

  constructor(rootTable: Table) {
    this.group = [];
    this.rootTable = rootTable;
  }

  get selectedIds() {
    return this.group.map(el => el.data.id);
  }

  // TODO make a focus manager
  focusToCell($cell: Dom) {
    const range = new Range();
    const node = $cell.$el;

    range.setStartAfter(node.childNodes[0]);

    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
  }

  select($el: Dom) {
    this.clearSelection();
    this.group = [$el];
    this.current = $el;
    $el.addClass(TableSelection.selectedClassName);
    this.focusToCell($el);
  }

  selectByCellId(cellID: { col: number, row: number }) {
    let { col, row } = cellID;

    if (col <= 0) col = 0;
    if (row <= 0) row = 0;

    this.clearSelection();
    this.current = $(`[data-id="${row}:${col}"]`);
    this.focusToCell(this.current);
    this.current.addClass(TableSelection.selectedClassName);
  }

  clearSelection() {
    this.group.forEach(el => el?.removeClass(TableSelection.selectedClassName));
    this.current?.removeClass(TableSelection.selectedClassName);
    this.group = [];
  }

  selectTo($el: Dom) {
    const startCellParams = getParamsFromCellId(this.current.data.id || startCellId);
    const selectedCellParams = getParamsFromCellId($el.data.id || startCellId);

    const startCol = Math.min(startCellParams.col, selectedCellParams.col);
    const endCol = Math.max(startCellParams.col, selectedCellParams.col);
    const startRow = Math.min(startCellParams.row, selectedCellParams.row);
    const endRow = Math.max(startCellParams.row, selectedCellParams.row);

    this.clearSelection();

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const $cell = $(`[data-id="${row}:${col}"]`);
        this.addCellToSelection($cell);
      }
    }
  }

  selectGroupies($cells: Dom[]) {
    this.clearSelection();
    $cells.forEach($cell => this.addCellToSelection($cell));
  }

  addCellToSelection($cell: Dom) {
    this.group.push($cell);
    $cell.addClass(TableSelection.selectedClassName);
  }

  applyStyle(style: CSSStyleRule) {
    this.group.forEach(el => el.css(style));
  }
}
