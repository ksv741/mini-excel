import { DomClass } from '../../core/dom';
import { ExcelComponent } from '../../core/ExcelComponent';

export class Formula extends ExcelComponent {
  static className = 'excel__formula';

  constructor($root: DomClass) {
    super($root, {
      listeners: ['input', 'click'],
      name: 'Formula',
    });
  }

  toHTML(): string {
    return `
    <div class="info">fx</div>
    <div class="input" contenteditable spellcheck="false"></div>
    `;
  }

  onInput(event: Event) {
    console.log('Formula on input listeners', event);
  }

  onClick() {

  }
}
