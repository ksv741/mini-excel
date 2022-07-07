import { $, Dom } from 'core/dom';
import { ExcelStateComponent } from 'core/ExcelStateComponent';
import { ActiveRoute } from 'core/routes/ActiveRoute';
import { deleteTable } from 'redux/actions';
import * as actions from 'redux/actions';

export class Header extends ExcelStateComponent {
  static className = 'excel__header';

  constructor($root: Dom, options: any) {
    super($root, {
      name: 'Header',
      listeners: ['input', 'click'],
      subscribe: ['title'],
      ...options,
    });
  }

  toHTML(): string {
    const { title } = this.store.getState();

    return `
    <input type="text" class="input" value="${title}">

    <div>
      <div class="button" data-button="delete-table">
        <i class="material-icons">delete</i>
      </div>
      <div class="button" data-button="exit">
        <i class="material-icons">exit_to_app</i>
      </div>
    `;
  }

  onInput(event: InputEvent) {
    const $target = $(event.target as HTMLInputElement);

    this.$dispatch(actions.changeTitle($target.text));
  }

  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target) return;

    const $btn = $(target).closest('[data-button]');
    if (!$btn.$el) return;

    const btnEvent = $btn?.data?.button;

    switch (btnEvent) {
      case 'exit': {
        ActiveRoute.navigateTo = '';
        break;
      }

      case 'delete-table': {
        confirm('Действительно хочешь удалить ?') && this.$dispatch(deleteTable(this.store.getState().id));
        break;
      }

      default:
        break;
    }
  }
}
