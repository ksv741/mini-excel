import { startCellId } from 'components/table/table.functions';
import * as actions from 'redux/actions';
import { $, Dom } from 'core/dom';
import { ExcelComponent } from 'core/ExcelComponent';
import { TableSelection } from 'components/table/TableSelection';
import { changeCurrentStyles } from 'redux/actions';
import { createTable } from 'components/table/table.template';
import { initialStyleState } from 'src/constants';
import { parse } from 'core/utils';
import { resizeHandler } from 'components/table/handlers/table.resize';
import { selectHandler } from 'components/table/handlers/table.select.handler';

export class Table extends ExcelComponent {
  static className = 'excel__table';

  private selection: TableSelection;

  constructor($root: Dom, options: any) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'keydown', 'input'],
      ...options,
    });
  }

  toHTML(): string {
    return createTable(50, 24);
  }

  prepare() {
    this.selection = new TableSelection();
  }

  init() {
    super.init();

    const $cell = this.$root.find(`[data-id="${startCellId}"]`);
    this.selection.select($cell);

    this.$emit('table:select-cell', $cell.data.value);

    this.$on('formula:input', (data) => {
      this.selection.current.attr('data-value', data);
      this.selection.current.text = parse(data);
      this.updateCurrentTextInStore(data);
    });

    this.$on('formula:enter-press', () => {
      this.selection.current.focus();
    });

    this.$on('toolbar:applyStyle', (value) => {
      this.selection.applyStyle(value);

      this.$dispatch(actions.applyStyle({
        value,
        ids: this.selection.selectedIds,
      }));
    });

    this.initTable();
  }

  initTable() {
    this.initTableSize();
    this.initTableContentAndStyles();
  }

  initTableSize() {
    const size = {
      col: this.store.getState()?.colState,
      row: this.store.getState()?.rowState,
    };

    Object.keys(size.col).forEach(key => {
      const cols = this.$root.findAll(`[data-col="${key}"]`);
      cols.forEach(el => $(el as HTMLElement).css({ width: `${size.col[key]}px` }));
    });

    Object.keys(size.row).forEach(key => {
      const rows = this.$root.findAll(`[data-row="${key}"]`);
      rows.forEach(el => $(el as HTMLElement).css({ height: `${size.row[key]}px` }));
    });
  }

  initTableContentAndStyles() {
    const tableState = this.store.getState();
    const tableContent = tableState?.dataState;
    const tableStyles = tableState?.stylesState;
    Object.keys(tableContent).forEach(cellId => {
      const $cell = this.$root.find(`[data-id="${cellId}"]`);
      const styles = tableStyles[cellId];

      $cell.text = parse(tableContent[cellId]) || '';
      $cell.setData('value', tableContent[cellId]);
      $cell.css(styles);
    });
  }

  emitSelectCallback() {
    this.$emit('table:select-cell', this.selection.current.data.value);

    const styles = this.selection.current?.getStyles(Object.keys(initialStyleState));
    this.$dispatch(changeCurrentStyles(styles));
  }

  async resizeTable(event: MouseEvent) {
    try {
      const resizeData = await resizeHandler(this.$root, event);
      this.$dispatch(actions.tableResize({ resizeData }));
    } catch (e) {
      console.warn('Resize error', e.message);
    }
  }

  updateCurrentTextInStore(text: string) {
    this.$dispatch(actions.changeText({
      text,
      id: this.selection.current.data.id || startCellId,
    }));
  }

  onMousedown(event: MouseEvent) {
    selectHandler(event, this.selection, this.emitSelectCallback.bind(this));
    this.resizeTable(event);
  }

  onKeydown(event: KeyboardEvent) {
    selectHandler(event, this.selection, this.emitSelectCallback.bind(this));
  }

  onInput(event: InputEvent) {
    this.updateCurrentTextInStore((event.target as HTMLElement).innerText.trim());
  }
}
