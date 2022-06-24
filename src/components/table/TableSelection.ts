import { $, Dom } from '../../core/dom';

export class TableSelection {
  static selectedClassName = 'selected';
  private group: Dom[];

  constructor() {
    this.group = [];
  }

  select($el: Dom) {
    this.clearSelection();
    this.group = [$el];
    $el.addClass(TableSelection.selectedClassName);
  }

  clearSelection() {
    this.group.forEach(el => el.removeClass(TableSelection.selectedClassName));
    this.group = [];
  }

  selectGroup($el: Dom) {
    const startCellParams = this.getParamsFromCellId(this.group[0].data.id);
    const selectedCellParams = this.getParamsFromCellId($el.data.id);

    const startCol = Math.min(+startCellParams.col, +selectedCellParams.col);
    const endCol = Math.max(+startCellParams.col, +selectedCellParams.col);
    const startRow = Math.min(+startCellParams.row, +selectedCellParams.row);
    const endRow = Math.max(+startCellParams.row, +selectedCellParams.row);

    this.clearSelection();

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const cell = $(`[data-id="${row}:${col}"]`);

        this.group.push(cell);
        cell.addClass(TableSelection.selectedClassName);
      }
    }
  }

  getParamsFromCellId(cellId: string) {
    const row = cellId.split(':')[0];
    const col = cellId.split(':')[1];

    return { col, row };
  }
}
