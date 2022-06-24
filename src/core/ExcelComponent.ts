import { DomListener } from './DomListener';

interface ExcelComponentClass {
  toHTML: () => string;
  prepare: () => void;
}

type OptionsType = {
  listeners?: string[];
  name: string;
};

export class ExcelComponent extends DomListener implements ExcelComponentClass {
  name: string;

  constructor($root: any, options: OptionsType) {
    super($root, options?.listeners);
    this.name = options?.name;

    this.prepare();
  }

  prepare() {

  }

  toHTML() {
    return '';
  }

  init() {
    this.initDOMListeners();
  }

  destroy() {
    this.removeDOMListeners();
  }
}
