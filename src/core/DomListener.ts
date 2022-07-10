import { Dom } from 'core/dom';
import { capitalize } from 'core/utils';

export class DomListener {
  $root: Dom;
  listeners: string[];

  constructor($root: Dom, listeners: string[]) {
    if (!$root) throw new Error('Не передали корневой элемент');

    this.$root = $root;
    this.listeners = listeners;
  }

  initDOMListeners() {
    if (!this.listeners) return;

    this.listeners.forEach((listener: string) => {
      const method: any = getMethodName(listener);
      // @ts-ignore FIXME:
      this[method] = this[method]?.bind(this);
      // @ts-ignore FIXME:
      if (!this[method]) throw new Error(`Отсутствует метод ${method} в компоненте ${this?.name}`);
      // @ts-ignore FIXME:
      this.$root.on(listener, this[method]);
    });
  }

  removeDOMListeners() {
    this.listeners.forEach(listener => {
      // @ts-ignore FIXME:
      const method: any = getMethodName(listener);
      // @ts-ignore FIXME:
      this.$root.off(listener, this[method]);
    });
  }
}

function getMethodName(eventName: string): string {
  return `on${capitalize(eventName)}`;
}
