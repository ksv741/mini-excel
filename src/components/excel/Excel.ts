import { $ } from 'core/dom';
import { Emitter } from 'core/Emitter';
import { ExcelComponent } from 'core/ExcelComponent';
import { Store } from 'core/store/Store';
import { StoreSubscriber } from 'core/StoreSubscriber';
import { updateOpenDate } from 'redux/action-creators';

interface ExcelOptionsType {
  components: any[],
  store: any,
}

export class Excel {
  components: any[];
  emitter: Emitter;
  store: Store;
  subscriber: StoreSubscriber;

  constructor(options: ExcelOptionsType) {
    this.components = options.components;
    this.emitter = new Emitter();
    this.store = options.store;
    this.subscriber = new StoreSubscriber(this.store);
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

    return $root;
  }

  init() {
    this.subscriber.subscribeComponents(this.components);
    this.components.forEach(component => component.init());

    this.store.dispatchToStore(updateOpenDate(Date.now().toString()));
  }

  destroy() {
    this.subscriber.unsubscribeFromStore();
    this.components.forEach(component => component.destroy());
  }
}
