import { BaseComponentOption } from 'components/excel/Excel';
import { $, Dom } from 'core/Dom';
import { ExcelComponent } from 'core/ExcelComponent';

export type ContextSelectType = {
  event: ContextEventType,
  target: Dom,
};

type ContextEventType =
  'add-row-before' |
  'remove-row' |
  'add-row-after' |
  'add-col-before' |
  'remove-col' |
  'add-col-after';

export class ContextMenu extends ExcelComponent {
  static className = 'excel__contextmenu_layer';
  private contextMenu: Dom;
  private contextType: string;
  private contextFor: Dom;

  constructor($root: Dom, options: BaseComponentOption) {
    super($root, {
      ...options,
      name: 'ContextMenu',
      eventListeners: ['click', 'mouseup'],
    });

    this.$onEventFromObserver('table:contextmenu', this.initContext);
    this.$onEventFromObserver('table:rerendercontext', this.rerender);

    this.contextType = 'row';
  }

  toHTML(): string {
    return this.createContextMenu();
  }

  afterRender() {
    super.afterRender();

    this.contextMenu = $('#excel__contextmenu');
  }

  transformContextMenuCoords(coords: { left: number, top: number }) {
    this.contextMenu.css({
      left: `${coords.left.toString()}px`,
      top: `${coords.top.toString()}px`,
    });
  }

  hideContextMenu() {
    this.transformContextMenuCoords({ left: 0, top: -100 });
    this.$root.removeClass('active');
  }

  initContext = (event: MouseEvent) => {
    const $target = $(event.target);
    if (!$target.closest('[data-header]').isExist) return;

    event.preventDefault();

    this.contextFor = $target;

    if ($target.data.header && $target.data.header !== this.contextType) {
      this.contextType = $target.data.header;
      this.$root.html(this.createContextMenu());
      this.contextMenu = $('#excel__contextmenu');
    }

    this.transformContextMenuCoords({ top: event.clientY, left: event.clientX });
    this.$root.addClass('active');
  };

  emitSelectItem(contextItem: Dom) {
    if (!contextItem.isExist) return;

    const contextEvent = contextItem?.data.contextitem;
    if (!contextEvent) return;

    const select = {
      target: this.contextFor,
      event: contextEvent,
    };

    this.$emitEventToObserver('context-menu: select', select);
  }

  createContextMenu() {
    if (this.contextType === 'row') {
      return `
        <div class="excel__contextmenu" id="excel__contextmenu">
          <div class="excel__contextmenu_item" tabindex="-1" data-contextitem="add-row-before">Добавить строку сверху</div>
          <div class="excel__contextmenu_item" tabindex="-1" data-contextitem="remove-row">Удалить строку</div>
          <div class="excel__contextmenu_item" tabindex="-1" data-contextitem="add-row-after">Добавить строку снизу</div>
        </div>
      `;
    }

    return `
      <div class="excel__contextmenu" id="excel__contextmenu">
        <div class="excel__contextmenu_item" tabindex="-1" data-contextitem="add-col-before">Добавить столбец слева</div>
        <div class="excel__contextmenu_item" tabindex="-1" data-contextitem="remove-col">Удалить столбец</div>
        <div class="excel__contextmenu_item" tabindex="-1" data-contextitem="add-col-after">Добавить столбец справа</div>
      </div>
    `;
  }

  onClick(e: MouseEvent) {
    const $target = $(e.target);
    if ($target.closest('#excel__contextmenu').isExist) {
      this.emitSelectItem($target);
      return;
    }

    this.hideContextMenu();
  }

  onMouseup() {
    this.hideContextMenu();
  }
}
