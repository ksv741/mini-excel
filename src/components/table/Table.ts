import { startCellId } from 'components/table/table.functions';
import * as actions from 'redux/action-creators';
import { $, Dom } from 'core/Dom';
import { ComponentOptionsType, ExcelComponent } from 'core/ExcelComponent';
import { TableSelection } from 'components/table/TableSelection';
import { changeCurrentStyles, changeCurrentText, changeTableSize, removeRowFromTable } from 'redux/action-creators';
import { createTable, getNewRowHTML } from 'components/table/table.template';
import { initialState, initialStyleState } from 'src/constants';
import { getCellId, parse } from 'core/utils';
import { resizeHandler } from 'components/table/handlers/table.resize';
import { selectHandler } from 'components/table/handlers/table.select.handler';

export class Table extends ExcelComponent {
  static className = 'excel__table';

  private selection: TableSelection;
  private isMouseDowned: boolean;
  private tableResizing = false;
  public tableSize = { row: initialState.tableSize.row, col: initialState.tableSize.col };

  constructor($root: Dom, options: ComponentOptionsType) {
    super($root, {
      ...options,
      name: 'Table',
      eventListeners: ['mousedown', 'keydown', 'input', 'mouseover', 'mouseup'],
    });

    this.isMouseDowned = false;
    const { col, row } = this.getTableSize();
    this.tableSize = { col, row };
  }

  toHTML(): string {
    console.log('Table size', this.tableSize);
    return createTable(this.tableSize.row, this.tableSize.col);
  }

  prepare() {
    this.selection = new TableSelection(this);
  }

  getTableSize() {
    const { tableSize: { col, row }, colState, rowState } = this.store.getState();
    const maxRowFromState = Math.max(...Object.keys(rowState).map(el => +el));
    const maxColFromState = Math.max(...Object.keys(colState).map(el => +el));

    const normalTableSize = {
      row: Math.max(maxRowFromState, row),
      col: Math.max(maxColFromState, col),
    };

    if ((maxColFromState !== this.tableSize.col) || (maxRowFromState !== this.tableSize.row)) {
      this.dispatchToStore(changeTableSize(normalTableSize));
    }

    return normalTableSize;
  }

  init() {
    super.init();

    this.initTable();

    this.$onEventFromObserver('formula:input', this.updateTextInCell);
    this.$onEventFromObserver('formula:enter-press', () => this.selection.$currentCell.focus());
    this.$onEventFromObserver('toolbar:applyStyle', this.updateCurrentStyles);
    this.$onEventFromObserver('toolbar:add-row', this.addNewRowHandler);
    this.$onEventFromObserver('toolbar:remove-row', this.removeRowHandler);
  }

  initTable() {
    this.initTableSize();
    this.initTableContentAndStyles();
    this.initStartCellFocus();
  }

  initTableSize() {
    const size = {
      col: this.store.getState()?.colState,
      row: this.store.getState()?.rowState,
    };

    this.initColSizes(this.$root, size.col);
    this.initRowSizes(this.$root, size.row);
  }

  initRowSizes(rootElem: Dom, rowState = this.store.getState()?.rowState) {
    if (!rootElem || !rootElem?.$el) return;

    Object.keys(rowState).forEach(key => {
      const rows = rootElem.findAll(`[data-row="${key}"]`);
      rows.forEach(el => $(el as HTMLElement).css({ height: `${rowState[+key]}px` }));
    });
  }

  initColSizes(rootElem: Dom, colState = this.store.getState()?.colState) {
    if (!rootElem || !rootElem?.$el) return;

    Object.keys(colState).forEach(key => {
      const cols = rootElem.findAll(`[data-col="${key}"]`);
      cols.forEach(el => $(el as HTMLElement).css({ width: `${colState[+key]}px` }));
    });
  }

  initTableContentAndStyles() {
    const tableState = this.store.getState();
    const tableContent = tableState?.dataState;
    const tableStyles = tableState?.stylesState;

    Object.keys(tableContent).forEach(cellId => {
      const $cell = this.$root.find(`[data-id="${cellId}"]`);
      const styles = tableStyles[cellId];

      if (!$cell.isExist) return;

      $cell.text = parse(tableContent[cellId]) || '';
      $cell.setData('value', tableContent[cellId]);
      $cell.css(styles);
    });
  }

  initStartCellFocus() {
    const $cell = this.$root.find(`[data-id="${startCellId}"]`);
    this.selection.select($cell);

    this.$emitEventToObserver('table:select-cell', $cell);
  }

  emitSelectCallback() {
    this.$emitEventToObserver('table:select-cell', this.selection.$currentCell);

    const styles = this.selection.$currentCell?.getStyles(Object.keys(initialStyleState));

    this.dispatchToStore(changeCurrentStyles(styles));
    this.dispatchToStore(changeCurrentText(this.selection.$currentCell.text));
  }

  async resizeTable(event: MouseEvent) {
    try {
      if (!$(event.target).closest('[data-resize]').isExist) return;
      this.tableResizing = true;
      const resizeData = await resizeHandler(this.$root, event);
      this.dispatchToStore(actions.tableResize(resizeData));
      this.tableResizing = false;
    } catch (e) {
      console.warn('Resize error', e.message);
    }
  }

  updateCurrentStyles = (style: Partial<CSSStyleDeclaration>) => {
    this.selection.applyStyle(style);
    this.dispatchToStore(actions.applyStyle({
      value: style,
      ids: this.selection.selectedIds,
    }));
  };

  updateTextInCell = (text: string, $cell = this.selection.$focusedCell) => {
    // eslint-disable-next-line no-param-reassign
    $cell.attr('data-value', text);
    // eslint-disable-next-line no-param-reassign
    $cell.text = parse(text);

    this.dispatchToStore(actions.changeText({
      text,
      id: $cell.data.id || startCellId,
    }));
  };

  addNewRowHandler = () => {
    this.tableSize.row++;
    this.$root.$el.insertAdjacentHTML('beforeend', getNewRowHTML(this.tableSize.row, this.tableSize.col));
    const $newRow = $(`[data-row="${this.tableSize.row - 1}"]`);
    this.initColSizes($newRow);

    this.dispatchToStore(changeTableSize(this.tableSize));
  };

  onMousedown(event: MouseEvent) {
    this.isMouseDowned = true;
    selectHandler(event, this.selection, this.emitSelectCallback.bind(this));
    this.resizeTable(event);
  }

  onKeydown(event: KeyboardEvent) {
    selectHandler(event, this.selection, this.emitSelectCallback.bind(this));
  }

  onInput(event: InputEvent) {
    this.updateTextInCell((event.target as HTMLElement).innerText);
  }

  onMouseover(event: MouseEvent) {
    this.isMouseDowned && !this.tableResizing && selectHandler(event, this.selection);
  }

  onMouseup() {
    this.isMouseDowned = false;
  }

  removeRowHandler = () => {
    const cell = this.selection.$focusedCell;
    const cellId = getCellId(cell);
    if (!cellId) return;

    const { row } = cellId;
    const nodeToRemove = this.$root.find(`[data-row='${row}']`);
    this.$root.removeChild(nodeToRemove);
    this.selection.clearSelection();

    this.dispatchToStore(removeRowFromTable(+row));
  };
}
