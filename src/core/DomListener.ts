import { Dom } from 'core/Dom';
import { getMethodNameByEventName } from 'core/utils';

// TODO fix types

export class DomListener {
  $root: Dom;
  eventListeners: string[];
  protected name: string;

  constructor($root: Dom, eventNames: string[]) {
    if (!$root) throw new Error('Не передали корневой элемент');

    this.$root = $root;
    this.eventListeners = eventNames;
  }

  initDOMListeners() {
    if (!this.eventListeners) return;

    this.eventListeners.forEach((listener: string) => {
      const method = getMethodNameByEventName(listener);
      // @ts-ignore
      this[method] = this[method]?.bind(this);
      // @ts-ignore
      if (!this[method]) throw new Error(`Отсутствует метод ${method} в компоненте ${this?.name}`);

      // @ts-ignore
      this.$root.on(listener, this[method]);
    });
  }

  removeDOMListeners() {
    this.eventListeners.forEach(listener => {
      const method = getMethodNameByEventName(listener);
      // @ts-ignore
      this.$root.off(listener, this[method]);
    });
  }
}
