import { Dom } from 'core/dom';
import { capitalize } from 'core/utils';

export class DomListener {
  $root: Dom;
  eventListeners: string[];

  constructor($root: Dom, eventNames: string[]) {
    if (!$root) throw new Error('Не передали корневой элемент');

    this.$root = $root;
    this.eventListeners = eventNames;
  }

  initDOMListeners() {
    if (!this.eventListeners) return;

    this.eventListeners.forEach((listener: string) => {
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
    this.eventListeners.forEach(listener => {
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
