import { $, Dom } from '../../core/dom';
import { getParamsFromCellId } from './table.functions';

export class TableSelection {
  static selectedClassName = 'selected';
  private group: Dom[];
  public current: Dom;

  constructor() {
    this.group = [];
    this.current = null;
  }

  get selectedIds() {
    return this.group.map(el => el.data.id);
  }

  select($el: Dom) {
    this.clearSelection();
    this.group = [$el];
    this.current = $el;
    $el.addClass(TableSelection.selectedClassName);
    $el.focus();
  }

  selectByCellId(cellID: { col: number, row: number }) {
    let { col, row } = cellID;

    if (col <= 0) col = 0;
    if (row <= 0) row = 0;

    this.clearSelection();
    this.current = $(`[data-id="${row}:${col}"]`);
    this.current.focus();
    this.current.addClass(TableSelection.selectedClassName);
  }

  clearSelection() {
    this.group.forEach(el => el?.removeClass(TableSelection.selectedClassName));
    this.current?.removeClass(TableSelection.selectedClassName);
    this.group = [];
  }

  selectGroup($el: Dom) {
    const startCellParams = getParamsFromCellId(this.current.data.id);
    const selectedCellParams = getParamsFromCellId($el.data.id);

    const startCol = Math.min(startCellParams.col, selectedCellParams.col);
    const endCol = Math.max(startCellParams.col, selectedCellParams.col);
    const startRow = Math.min(startCellParams.row, selectedCellParams.row);
    const endRow = Math.max(startCellParams.row, selectedCellParams.row);

    this.clearSelection();

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const cell = $(`[data-id="${row}:${col}"]`);

        this.group.push(cell);
        cell.addClass(TableSelection.selectedClassName);
      }
    }
  }

  applyStyle(style: CSSStyleRule) {
    this.group.forEach(el => el.css(style));
  }
}
