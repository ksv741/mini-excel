import { ContextMenu } from 'components/ContextMenu/ContextMenu';
import { Formula } from 'components/formula/Formula';
import { Header } from 'components/header/Header';
import { Table } from 'components/table/Table';
import { Toolbar } from 'components/toolbar/Toolbar';
import { ComponentManager } from 'core/ComponentManager';
import { Observer } from 'core/Observer';
import { Store } from 'core/store/Store';
import { StoreSubscriber } from 'core/StoreSubscriber';
import { updateOpenDate } from 'redux/action-creators';

// TODO type for components array
interface ExcelOptionsType {
  components: ComponentType[],
  store: Store,
}

export type ComponentType = typeof Header | typeof Toolbar | typeof Formula | typeof Table | typeof ContextMenu;

export type BaseComponentOption = {
  observer: Observer;
  store: Store;
  componentManager: ComponentManager;
};

export class Excel {
  components: any[];
  observer: Observer;
  store: Store;
  subscriber: StoreSubscriber;
  componentManage: ComponentManager;

  constructor(options: ExcelOptionsType) {
    this.store = options.store;
    this.components = options.components;

    this.subscriber = new StoreSubscriber(this.store);
    this.observer = new Observer();
    this.componentManage = new ComponentManager();
  }

  getRoot() {
    const componentOptions: BaseComponentOption = {
      observer: this.observer,
      store: this.store,
      componentManager: this.componentManage,
    };
    this.components = this.components.map(Component => this.componentManage.createComponent(Component, componentOptions));
    this.componentManage.addComponentsToRoot(this.components);

    return this.componentManage.$rootExcelElement;
  }

  afterRender() {
    this.subscriber.subscribeComponents(this.components);
    this.components.forEach(component => component.afterRender());

    this.store.dispatchToStore(updateOpenDate(Date.now().toString()));
  }

  destroy() {
    this.subscriber.unsubscribeFromStore();
    this.componentManage.destroyComponents();
  }
}
