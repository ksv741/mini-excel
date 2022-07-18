import { Table } from 'components/table/Table';
import { $, Dom } from 'core/Dom';
import { parse } from 'core/utils';

export class FocusManager {
  private rootTable: Table;
  public $currentFocusedCell: Dom | null;

  constructor(rootTable: Table) {
    this.rootTable = rootTable;

    this.initManager();
  }

  private initManager() {
    this.$currentFocusedCell = null;
  }

  resetFocus() {
    window.getSelection()?.removeAllRanges();
    (document.activeElement as HTMLElement)?.blur();
    this.$currentFocusedCell = null;
  }

  focusOnTable() {
    this.rootTable.$root.focus();
  }

  focusCell($cell: Dom) {
    try {
      const r = new Range();
      const innerText = $cell.$el.childNodes[$cell.$el.childNodes.length - 1];

      if (innerText !== undefined) {
        r.setEndAfter(innerText);
        r.setStartBefore(innerText);
        r.collapse(false);

        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(r);
      } else {
        $cell.focus();
      }

      this.$currentFocusedCell = $cell;
    } catch (e) {
      console.log('FocusManager: ', e.message);
      this.rootTable.selectionManager.clearAllSelection();
    }
  }

  onFocusOut(event: FocusEvent) {
    const $target = $(event.target);
    if (!this.$currentFocusedCell?.isEqual($target)) return;

    this.rootTable.updateTextInCell(parse($target.dataValue), $target, true);
  }
}
