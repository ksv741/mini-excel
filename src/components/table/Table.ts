import { ExcelComponent } from '../../core/ExcelComponent';
import { selectHandler } from './handlers/table.select.handler';
import { TableSelection } from './TableSelection';
import { createTable } from './table.template';
import { resizeHandler } from './handlers/table.resize';

export class Table extends ExcelComponent {
  static className = 'excel__table';

  private selection: TableSelection;

  constructor($root: any) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown'],
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
  }

  onMousedown(event: MouseEvent) {
    selectHandler(event, this.selection);
    resizeHandler(this.$root, event);
  }
}
