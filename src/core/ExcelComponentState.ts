import { Dom } from 'core/Dom';
import { ExcelComponent, ComponentOptionsType } from 'core/ExcelComponent';

type ExcelComponentStateType = {
  [k: string]: any;
};

export abstract class ExcelComponentState extends ExcelComponent {
  componentState: ExcelComponentStateType;

  protected constructor(root: Dom, options: ComponentOptionsType) {
    super(root, options);
  }

  get template(): string {
    return JSON.stringify(this.componentState, null, 2);
  }

  initComponentState(initialState = {}) {
    this.componentState = { ...initialState };
  }

  setComponentState(newState: ExcelComponentStateType) {
    this.componentState = { ...this.componentState, ...newState };
    this.$root.html(this.template);
  }
}
