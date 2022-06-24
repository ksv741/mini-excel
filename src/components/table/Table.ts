import { $ } from '../../core/dom';
import { ExcelComponent } from '../../core/ExcelComponent';
import { isCell } from './table.functions';
import { TableSelection } from './TableSelection';
import { createTable } from './table.template';
import { resizeHandler } from './handlers/table.resize';

export class Table extends ExcelComponent {
  static className = 'excel__table';

  private selection: any;

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
    if (isCell(event)) {
      this.selection.select($(event.target as HTMLElement));
      return;
    }

    resizeHandler(this.$root, event);
  }
}
