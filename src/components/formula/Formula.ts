import { Dom } from 'core/dom';
import { ExcelComponent, ComponentOptionsType } from 'core/ExcelComponent';

export class Formula extends ExcelComponent {
  static className = 'excel__formula';

  private formulaInput: Dom;

  constructor($root: Dom, options: ComponentOptionsType) {
    super($root, {
      // @ts-ignore next-line
      eventListeners: ['input', 'keydown'],
      // @ts-ignore next-line
      name: 'Formula',
      // @ts-ignore next-line
      subscribe: ['currentText'],
      ...options,
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

    this.$on('table:select-cell', (cell: Dom) => {
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
    this.$emit('formula:input', text);
  }

  onKeydown(event: KeyboardEvent) {
    const preventedKeys = ['Enter', 'Tab'];

    if (preventedKeys.includes(event.key)) event.preventDefault();

    if (event.key === 'Enter') {
      this.$emit('formula:enter-press');
    }
  }
}
