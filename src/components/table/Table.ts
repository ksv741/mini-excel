import { startCellId } from 'components/table/table.functions';
import * as actions from 'redux/action-creators';
import { $, Dom } from 'core/Dom';
import { ComponentOptionsType, ExcelComponent } from 'core/ExcelComponent';
import { TableSelection } from 'components/table/TableSelection';
import { changeCurrentStyles, changeCurrentText } from 'redux/action-creators';
import { createTable, getNewRowHTML } from 'components/table/table.template';
import { initialStyleState } from 'src/constants';
import { parse } from 'core/utils';
import { resizeHandler } from 'components/table/handlers/table.resize';
import { selectHandler } from 'components/table/handlers/table.select.handler';

export class Table extends ExcelComponent {
  static className = 'excel__table';

  private selection: TableSelection;
  private isMouseDowned: boolean;
  private tableResizing = false;
  public tableSize = {
    row: 50,
    col: 24,
  };

  constructor($root: Dom, options: ComponentOptionsType) {
    super($root, {
      ...options,
      name: 'Table',
      eventListeners: ['mousedown', 'keydown', 'input', 'mouseover', 'mouseup'],
    });

    this.isMouseDowned = false;
  }

  toHTML(): string {
    return createTable(this.tableSize.row, this.tableSize.col);
  }

  prepare() {
    this.selection = new TableSelection(this);
  }

  init() {
    super.init();

    this.initTable();

    this.$onEventFromObserver('formula:input', this.updateCurrentText);
    this.$onEventFromObserver('formula:enter-press', () => this.selection.current.focus());
    this.$onEventFromObserver('toolbar:applyStyle', this.updateCurrentStyles);
    this.$onEventFromObserver('toolbar:add-row', this.addNewRowHandler);
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
    this.$emitEventToObserver('table:select-cell', this.selection.current);

    const styles = this.selection.current?.getStyles(Object.keys(initialStyleState));

    this.dispatchToStore(changeCurrentStyles(styles));
    this.dispatchToStore(changeCurrentText(this.selection.current.text));
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

  updateCurrentText = (text: string) => {
    this.selection.current.attr('data-value', text);
    this.selection.current.text = parse(text);

    this.dispatchToStore(actions.changeText({
      text,
      id: this.selection.current.data.id || startCellId,
    }));
  };

  updateCurrentStyles = (style: CSSStyleDeclaration) => {
    this.selection.applyStyle(style);
    this.dispatchToStore(actions.applyStyle({
      value: style,
      ids: this.selection.selectedIds,
    }));
  };

  addNewRowHandler = () => {
    this.tableSize.row++;
    this.$root.$el.insertAdjacentHTML('beforeend', getNewRowHTML(this.tableSize.row, this.tableSize.col));
    const $newRow = $(`[data-row="${this.tableSize.row - 1}"]`);
    this.initColSizes($newRow);
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
    this.updateCurrentText((event.target as HTMLElement).innerText);
  }

  onMouseover(event: MouseEvent) {
    this.isMouseDowned && !this.tableResizing && selectHandler(event, this.selection);
  }

  onMouseup() {
    this.isMouseDowned = false;
  }
}
