import { initialStyleState } from '../../constants';
import { $, Dom } from '../../core/dom';
import { OptionsType } from '../../core/ExcelComponent';
import { ExcelStateComponent } from '../../core/ExcelStateComponent';
import { createToolbar } from './toolbar.template';

export class Toolbar extends ExcelStateComponent {
  static className = 'excel__toolbar';

  constructor($root: Dom, options: OptionsType) {
    super($root, {
      name: 'Toolbar',
      listeners: ['click'],
      subscribe: ['currentStyles'],
      ...options,
    });
  }

  prepare() {
    const currentToolbarState = this.toolbarState;
    console.log('Current state', currentToolbarState);

    this.initState(currentToolbarState);
  }

  get toolbarState() {
    return {
      ...initialStyleState,
      ...this.store.getState().stylesState['0:0'],
    };
  }

  get template(): string {
    return createToolbar(this.state);
  }

  toHTML(): string {
    return this.template;
  }

  storeChanged(args?: any) {
    this.setState(args.currentStyles);
  }

  onClick(event: MouseEvent) {
    const target = $(event.target as HTMLElement);
    const value = JSON.parse(target.data.value);
    const key = Object.keys(value)[0];

    this.$emit('toolbar:applyStyle', value);

    this.setState({ [key]: value[key] });
  }
}
