import { ActionType } from 'redux/types';
import { Store } from 'core/store/createStore';
import { Dom } from 'core/dom';
import { DomListener } from 'core/DomListener';
import { Emitter } from 'core/Emitter';

interface ExcelComponentClass {
  toHTML: () => string;
  prepare: () => void;
  storeChanged?: (args: any) => void;
}

export type OptionsType = {
  listeners?: string[];
  name: string;
  emitter?: Emitter;
  store: Store;
  subscribe: string[],
};

export abstract class ExcelComponent extends DomListener implements ExcelComponentClass {
  private name: string | undefined;
  private emitter: Emitter | undefined;
  private store: Store | undefined;
  private subscribe: string[] | undefined;
  private unsubscribers: ((args?: any) => any)[];

  constructor($root: Dom, options?: OptionsType) {
    super($root, options?.listeners);
    this.name = options?.name;
    this.emitter = options?.emitter;
    this.store = options?.store;
    this.subscribe = options?.subscribe;

    this.unsubscribers = [];
    this.prepare();
  }

  prepare() {

  }

  toHTML() {
    return '';
  }

  $emit(event: string, args?: any): void {
    this.emitter?.emit(event, args);
  }

  $on(event: string, callback: (args: any) => any) {
    const unsub = this.emitter?.subscribe(event, callback);
    unsub && this.unsubscribers.push(unsub);
  }

  $dispatch(action: ActionType) {
    this.store?.dispatch(action);
  }

  storeChanged(args?: any) {
    console.log('CHANGE STORE: ', args);
  }

  isWatching(key: string) {
    return this.subscribe?.includes(key);
  }

  init() {
    this.initDOMListeners();
  }

  destroy() {
    this.removeDOMListeners();
    this.unsubscribers.forEach(unsub => unsub());
  }
}
