import { Dom } from '../../core/dom';
import { ExcelComponent } from '../../core/ExcelComponent';

export class Formula extends ExcelComponent {
  static className = 'excel__formula';

  private formulaInput: Dom;

  constructor($root: Dom, options: any) {
    super($root, {
      listeners: ['input', 'keydown'],
      name: 'Formula',
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

    this.$on('table:select-cell', text => {
      this.formulaInput.text = text;
    });
  }

  storeChanged({ currentText = '' }) {
    this.formulaInput.text = currentText;
  }

  onInput(event: Event) {
    const text = (event.target as HTMLElement).textContent.trim();
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
