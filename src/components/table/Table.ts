import { ExcelComponent } from '../../core/ExcelComponent';
import { createTable } from './table.template';
import { resizeHandler } from './table.resize';

export class Table extends ExcelComponent {
  static className = 'excel__table';

  constructor($root: any) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown'],
    });
  }

  toHTML(): string {
    return createTable(50, 24);
  }

  onMousedown(event: MouseEvent) {
    resizeHandler(this.$root, event);
  }
}
