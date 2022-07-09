import { Dom } from 'core/dom';
import { ExcelComponent, OptionsType } from 'core/ExcelComponent';

type ExcelComponentStateType = {
  [k: string]: any;
};

export abstract class ExcelStateComponent extends ExcelComponent {
  state: ExcelComponentStateType;

  protected constructor(root: Dom, options: OptionsType) {
    super(root, options);
  }

  get template(): string {
    return JSON.stringify(this.state, null, 2);
  }

  initState(initialState = {}) {
    this.state = { ...initialState };
  }

  setState(newState: ExcelComponentStateType) {
    this.state = { ...this.state, ...newState };
    this.$root.html(this.template);
  }
}
