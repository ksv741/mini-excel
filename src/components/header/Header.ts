import { $, Dom } from '../../core/dom';
import { ExcelComponent } from '../../core/ExcelComponent';
import * as actions from '../../redux/actions';

export class Header extends ExcelComponent {
  static className = 'excel__header';

  constructor($root: Dom, options: any) {
    super($root, {
      name: 'Header',
      listeners: ['input'],
      ...options,
    });
  }

  toHTML(): string {
    const { title } = this.store.getState();

    return `
    <input type="text" class="input" value="${title}">

    <div>
      <div class="button">
        <i class="material-icons">delete</i>
      </div>
      <div class="button">
        <i class="material-icons">exit_to_app</i>
      </div>
    `;
  }

  onInput(event: InputEvent) {
    const $target = $(event.target as HTMLInputElement);

    this.$dispatch(actions.changeTitle($target.text));
  }
}
