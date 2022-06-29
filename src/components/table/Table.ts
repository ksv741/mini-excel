import * as actions from '../../redux/actions';
import { $, DomClass } from '../../core/dom';
import { ExcelComponent } from '../../core/ExcelComponent';
import { TableSelection } from './TableSelection';
import { createTable } from './table.template';
import { resizeHandler } from './handlers/table.resize';
import { selectHandler } from './handlers/table.select.handler';

export class Table extends ExcelComponent {
  static className = 'excel__table';

  private selection: TableSelection;

  constructor($root: DomClass, options: any) {
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

    const $cell = this.$root.find('[data-id="0:0"]');
    this.selection.select($cell);

    this.$emit('table:select-cell', $cell.text);

    this.$on('formula:input', (data) => {
      this.selection.current.text = data;
    });

    this.$on('formula:enter-press', () => {
      this.selection.current.focus();
    });

    // this.$subscribe(state => {
    //   console.log('State in Table', state);
    // });

    this.initTableSize();
  }

  initTableSize() {
    const colSizes = this.store.getState()?.colState;
    Object.keys(colSizes).forEach(key => {
      const cols = this.$root.findAll(`[data-col="${key}"]`);
      cols.forEach(el => $(el as HTMLElement).css({ width: `${colSizes[key]}px` }));
    });
  }

  emitSelectCallback() {
    this.$emit('table:select-cell', this.selection.current.text);
  }

  async resizeTable(event: MouseEvent) {
    try {
      const resizeData = await resizeHandler(this.$root, event);
      this.$dispatch(actions.tableResize({ resizeData }));
    } catch (e) {
      console.warn('Resize error', e.message);
    }
  }

  onMousedown(event: MouseEvent) {
    selectHandler(event, this.selection, this.emitSelectCallback.bind(this));
    this.resizeTable(event);
  }

  onKeydown(event: KeyboardEvent) {
    selectHandler(event, this.selection, this.emitSelectCallback.bind(this));
  }

  onInput(event: InputEvent) {
    const inputText = (event.target as HTMLElement).textContent.trim();
    this.$emit('table:input', inputText);
  }
}
