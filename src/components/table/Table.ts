import { ContextSelectType } from 'components/ContextMenu/ContextMenu';
import { BaseComponentOption } from 'components/excel/Excel';
import { FocusManager } from 'components/table/FocusManager';
import { SelectionManager } from 'components/table/SelectionManager';
import { startCellId } from 'components/table/table.functions';
import { parse } from 'core/utils';
import * as actions from 'redux/action-creators';
import { $, Dom } from 'core/Dom';
import { ExcelComponent } from 'core/ExcelComponent';
import {
  addCol,
  addRow, changeCurrentStyles, changeCurrentText,
  changeTableSize, removeColFromTable,
  removeRowFromTable,
} from 'redux/action-creators';
import { createTable } from 'components/table/table.template';
import { TableSizeType } from 'redux/types';
import { resizeHandler } from 'components/table/handlers/table.resize';
import { initialStyleState } from 'src/constants';

export class Table extends ExcelComponent {
  static className = 'excel__table';

  private tableResizing: boolean;
  public tableSize: TableSizeType;
  selectionManager: SelectionManager;
  focusManager: FocusManager;

  constructor($root: Dom, options: BaseComponentOption) {
    super($root, {
      ...options,
      name: 'Table',
      eventListeners: ['mousedown', 'keydown', 'input', 'mouseover', 'mouseup', 'contextmenu', 'dblclick', 'focusout'],
    });
  }

  toHTML(): string {
    return createTable(this.tableSize.row, this.tableSize.col);
  }

  beforeRender() {
    this.tableResizing = false;
    this.tableSize = this.getTableSize();
    this.selectionManager = new SelectionManager(this);
    this.focusManager = new FocusManager(this);
  }

  afterRender() {
    super.afterRender();

    this.initTable();

    this.$onEventFromObserver('formula:input', this.updateTextInCell);
    // this.$onEventFromObserver('formula:enter-press', () => this.selection.$currentCell.focus());
    this.$onEventFromObserver('toolbar:applyStyle', this.updateCurrentStyles);
    this.$onEventFromObserver('toolbar:add-row', this.addNewRowHandler);
    this.$onEventFromObserver('toolbar:remove-row', this.removeRowHandler);
    this.$onEventFromObserver('context-menu: select', this.contextMenuHandler);
  }

  getTableSize() {
    const { tableSize: { col, row }, colState, rowState } = this.store.getState();
    const maxRowFromState = Math.max(...Object.keys(rowState).map(el => +el));
    const maxColFromState = Math.max(...Object.keys(colState).map(el => +el));

    const normalTableSize = {
      row: Math.max(maxRowFromState, row),
      col: Math.max(maxColFromState, col),
    };

    if ((maxColFromState !== this.tableSize?.col) || (maxRowFromState !== this.tableSize?.row)) {
      this.dispatchToStore(changeTableSize(normalTableSize));
    }

    return normalTableSize;
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
    // const $cell = this.$root.find(`[data-id="${startCellId}"]`);
    // this.selection.select($cell);
    //
    // this.$emitEventToObserver('table:select-cell', $cell);
  }

  emitSelectCallback($cell: Dom) {
    this.$emitEventToObserver('table:select-cell', $cell);

    const styles = $cell.getStyles(Object.keys(initialStyleState));

    this.dispatchToStore(changeCurrentStyles(styles));
    this.dispatchToStore(changeCurrentText($cell.dataValue));
  }

  async resizeTable(event: MouseEvent) {
    try {
      if (!$(event.target).closest('[data-resize]')?.isExist) return;
      this.tableResizing = true;
      const resizeData = await resizeHandler(this.$root, event);
      this.dispatchToStore(actions.tableResize(resizeData));
      this.tableResizing = false;
    } catch (e) {
      console.warn('Resize error', e.message);
    }
  }

  updateCurrentStyles = (style: Partial<CSSStyleDeclaration>) => {
    this.selectionManager.applyStyle(style);
    this.dispatchToStore(actions.applyStyle({
      value: style,
      ids: this.selectionManager.selectedIds,
    }));
  };

  updateTextInCell = (text: string, $cell?: Dom, changeVisibleText?: boolean) => {
    if (!$cell || !$cell.isExist) return;

    if (!changeVisibleText) {
      $cell.attr('data-value', text);

      this.dispatchToStore(actions.changeText({
        text: $cell.dataValue.toString(),
        id: $cell.data.id || startCellId,
      }));
    } else {
      // eslint-disable-next-line no-param-reassign
      $cell.text = text || '';
    }
  };

  addNewRowHandler = () => {
    this.addNewColRow('row', 'after', this.tableSize.row);
  };

  addNewColRow(type: 'col' | 'row', position: 'after' | 'before', targetIndex: number) {
    if (targetIndex === undefined) return;
    type === 'col'
      ? this.dispatchToStore(addCol({ position, targetIndex }))
      : this.dispatchToStore(addRow({ position, targetIndex }));

    this.rerender();
  }

  removeRowHandler = () => {
    // const cell = this.selection.$focusedCell;
    // const cellId = getCellId(cell);
    // if (!cellId) return;
    //
    // const { row } = cellId;
    // this.removeColRow('row', +row);
  };

  removeColRow = (type: 'col' | 'row', index: number) => {
    if (!type || !index) return;

    type === 'col'
      ? this.dispatchToStore(removeColFromTable(index))
      : this.dispatchToStore(removeRowFromTable(index));
    this.rerender();
  };

  contextMenuHandler = (select: ContextSelectType) => {
    const { event, target } = select;

    switch (event) {
      case 'add-row-before': {
        const idx = target.closest('[data-row]').data.row;
        if (!idx) return;
        this.addNewColRow('row', 'before', +idx);
        break;
      }

      case 'add-row-after': {
        const idx = target.closest('[data-row]').data.row;
        if (!idx) return;
        this.addNewColRow('row', 'after', +idx);
        break;
      }

      case 'remove-row': {
        const idx = target.closest('[data-row]').data.row;
        if (!idx) return;

        this.removeColRow('row', +idx);
        break;
      }

      case 'add-col-before': {
        const idx = target.closest('[data-col]').data.col;
        if (!idx) return;
        this.addNewColRow('col', 'before', +idx);
        break;
      }

      case 'add-col-after': {
        const idx = target.closest('[data-col]').data.col;
        if (!idx) return;
        this.addNewColRow('col', 'after', +idx);
        break;
      }

      case 'remove-col': {
        const idx = target.closest('[data-col]').data.col;
        if (!idx) return;

        this.removeColRow('col', +idx);
        break;
      }

      default: break;
    }
  };

  onMousedown(event: MouseEvent) {
    this.resizeTable(event);
    this.selectionManager.onMouseDownHandler(event);
  }

  onKeydown(event: KeyboardEvent) {
    this.selectionManager.onKeyDownHandler(event);
  }

  onInput(event: InputEvent) {
    const $target = $(event.target);
    if (!this.focusManager.$currentFocusedCell) return;

    this.updateTextInCell($target.text, this.focusManager.$currentFocusedCell);
  }

  onMouseover(event: MouseEvent) {
    this.selectionManager.onMouseOverHandler(event);
  }

  onMouseup() {
    this.selectionManager.onMouseUpHandler();
  }

  onContextmenu(event: MouseEvent) {
    const $target = $(event.target);

    this.selectionManager.clearAllSelection();
    this.selectionManager.selectHeadRowCol($target);

    this.$emitEventToObserver('table:contextmenu', event);
  }

  onDblclick(event: MouseEvent) {
    this.selectionManager.doubleClickHandler(event);
  }

  onFocusout(event: FocusEvent) {
    this.focusManager.onFocusOut(event);
  }
}
