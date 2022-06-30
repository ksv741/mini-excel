import { Store } from '../../core/createStore';
import { $, Dom } from '../../core/dom';
import { Emitter } from '../../core/Emitter';
import { ExcelComponent } from '../../core/ExcelComponent';
import { StoreSubscriber } from '../../core/StoreSubscriber';

interface ExcelOptionsType {
  components: any[],
  store: any,
}

export class Excel {
  $el: HTMLElement | Dom;
  components: any[];
  emitter: Emitter;
  store: Store;
  subscriber: StoreSubscriber;

  constructor(selector: string, options: ExcelOptionsType) {
    this.$el = $(selector);
    this.components = options.components;
    this.emitter = new Emitter();
    this.store = options.store;
    this.subscriber = new StoreSubscriber(this.store);

    console.log(`Created new Excel class in ${selector} with options: ${options}`);
  }

  getRoot() {
    const $root = $.create('div', 'excel');

    const componentOptions = {
      emitter: this.emitter,
      store: this.store,
    };

    this.components = this.components.map(Component => {
      const $el = $.create('div', Component.className);
      const component: ExcelComponent = new Component($el, componentOptions);

      $el.html(component.toHTML());
      $root.append($el.$el);

      return component;
    });

    return $root.$el;
  }

  render() {
    this.$el.append(this.getRoot());

    this.subscriber.subscribeComponents(this.components);
    this.components.forEach(component => component.init());
  }

  destroy() {
    this.subscriber.unsubscribeFromStore();
    this.components.forEach(component => component.destroy());
  }
}
