import { startCellId } from 'components/table/table.functions';
import { $, Dom } from 'core/dom';
import { ExcelStateComponent } from 'core/ExcelStateComponent';
import { OptionsType } from 'core/ExcelComponent';
import { createToolbar } from 'components/toolbar/toolbar.template';
import { initialStyleState } from 'src/constants';

export class Toolbar extends ExcelStateComponent {
  static className = 'excel__toolbar';

  constructor($root: Dom, options: OptionsType) {
    super($root, {
      ...options,
      listeners: ['click'],
      name: 'Toolbar',
      subscribe: ['currentStyles'],
    });
  }

  prepare() {
    const currentToolbarState = this.toolbarState;

    this.initState(currentToolbarState);
  }

  get toolbarState() {
    return {
      ...initialStyleState,
      ...this.store?.getState()?.stylesState?.[startCellId],
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
    const stringValue = target?.data?.value;
    if (!stringValue) return;

    const value = JSON.parse(stringValue);
    const key = Object.keys(value)[0];

    this.$emit('toolbar:applyStyle', value);

    this.setState({ [key]: value[key] });
  }
}
