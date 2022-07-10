import { ComponentOptionsType, ExcelComponent } from 'core/ExcelComponent';
import * as actions from 'redux/action-creators';
import { $, Dom } from 'core/Dom';
import { ActiveRoute } from 'core/routes/ActiveRoute';
import { deleteTable } from 'redux/action-creators';

export class Header extends ExcelComponent {
  static className = 'excel__header';

  constructor($root: Dom, options: ComponentOptionsType) {
    super($root, {
      ...options,
      name: 'Header',
      eventListeners: ['input', 'click'],
      subscribe: ['title'],
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

    this.dispatchToStore(actions.changeTitle($target.text));
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
        confirm('Действительно хочешь удалить ?') && this.dispatchToStore(deleteTable(this.store.getState().id));
        break;
      }

      default:
        break;
    }
  }
}
