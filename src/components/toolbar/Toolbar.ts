import { startCellId } from 'components/table/table.functions';
import { $, Dom } from 'core/Dom';
import { ExcelComponentState } from 'core/ExcelComponentState';
import { ComponentOptionsType } from 'core/ExcelComponent';
import { createToolbar } from 'components/toolbar/toolbar.template';
import { initialStyleState } from 'src/constants';

export class Toolbar extends ExcelComponentState {
  static className = 'excel__toolbar';

  constructor($root: Dom, options: ComponentOptionsType) {
    super($root, {
      ...options,
      eventListeners: ['click', 'change'],
      name: 'Toolbar',
      subscribe: ['currentStyles'],
    });
  }

  prepare() {
    const currentToolbarState = this.toolbarState;

    this.initComponentState(currentToolbarState);
  }

  get toolbarState() {
    return {
      ...initialStyleState,
      ...this.store?.getState()?.stylesState?.[startCellId],
    };
  }

  get template(): string {
    return createToolbar(this.componentState);
  }

  toHTML(): string {
    return this.template;
  }

  storeChanged(args?: any) {
    this.setComponentState(args.currentStyles);
  }

  onClick(event: MouseEvent) {
    const target = $(event.target as HTMLElement);
    const stringValue = target?.data?.value;
    if (!stringValue) return;

    const value = JSON.parse(stringValue);
    const key = Object.keys(value)[0];

    this.$emitEventToObserver('toolbar:applyStyle', value);
    this.setComponentState({ [key]: value[key] });
  }

  onChange(e: any) {
    const target = $(e.target);
    let value = '';
    let key = '';

    switch (true) {
      case !!target.closest('#button-size').$el:
        value = `${e.target.value.toString()}px`;
        key = 'fontSize';
        break;

      case !!target.closest('#button-font').$el:
        value = e.target.value;
        key = 'fontFamily';
        break;

      default: break;
    }

    if (key && value) {
      this.$emitEventToObserver('toolbar:applyStyle', { [key]: value });
      this.setComponentState({ [key]: value });
    }
  }
}
