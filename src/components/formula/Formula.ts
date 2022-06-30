import { Dom, DomClass } from '../../core/dom';
import { ExcelComponent } from '../../core/ExcelComponent';

export class Formula extends ExcelComponent {
  static className = 'excel__formula';

  private formulaInput: Dom;

  constructor($root: DomClass, options: any) {
    super($root, {
      listeners: ['input', 'keydown'],
      name: 'Formula',
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

    // this.$on('table:input', text => {
    //   this.formulaInput.text = text;
    // });
    this.$on('table:select-cell', text => {
      this.formulaInput.text = text;
    });

    this.$subscribe(state => {
      this.formulaInput.text = state.currentText;
    });
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
