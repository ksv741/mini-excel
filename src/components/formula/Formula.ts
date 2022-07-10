import { Dom } from 'core/Dom';
import { ExcelComponent, ComponentOptionsType } from 'core/ExcelComponent';

export class Formula extends ExcelComponent {
  static className = 'excel__formula';

  private formulaInput: Dom;

  constructor($root: Dom, options: ComponentOptionsType) {
    super($root, {
      ...options,
      eventListeners: ['input', 'keydown'],
      name: 'Formula',
      subscribe: ['currentText'],
    });
  }

  toHTML(): string {
    return `
      <div class="info">fx</div>
      <div id="formula-input" class="input" contenteditable spellcheck="false"></div>
    `;
  }

  init() {
    super.init();

    this.formulaInput = this.$root.find('#formula-input');

    this.$onEventFromObserver('table:select-cell', (cell: Dom) => {
      this.formulaInput.text = cell.data.value || '';
    });
  }

  storeChanged({ currentText = '' }) {
    this.formulaInput.text = currentText;
  }

  onInput(event: InputEvent) {
    const { target } = event;
    if (!target) return;

    const text = (target as HTMLElement).innerText.trim();

    this.$emitEventToObserver('formula:input', text);
  }

  onKeydown(event: KeyboardEvent) {
    const preventedKeys = ['Enter', 'Tab'];

    if (preventedKeys.includes(event.key)) event.preventDefault();

    if (event.key === 'Enter') {
      this.$emitEventToObserver('formula:enter-press');
    }
  }
}
