import { Dom } from '../../core/dom';

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

  selectGroup() {

  }
}
