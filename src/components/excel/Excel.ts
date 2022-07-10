import { $ } from 'core/Dom';
import { Observer } from 'core/Observer';
import { ExcelComponent } from 'core/ExcelComponent';
import { Store } from 'core/store/Store';
import { StoreSubscriber } from 'core/StoreSubscriber';
import { updateOpenDate } from 'redux/action-creators';

interface ExcelOptionsType {
  components: any[],
  store: any,
}

type BaseComponentOption = {
  observer: Observer;
  store: Store;
};

export class Excel {
  components: any[];
  observer: Observer;
  store: Store;
  subscriber: StoreSubscriber;

  constructor(options: ExcelOptionsType) {
    this.components = options.components;
    this.observer = new Observer();
    this.store = options.store;
    this.subscriber = new StoreSubscriber(this.store);
  }

  getRoot() {
    const $root = $.create('div', 'excel');

    const componentOptions: BaseComponentOption = {
      observer: this.observer,
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
