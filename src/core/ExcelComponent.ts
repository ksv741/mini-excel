import { ActionType, StateType, SubscribeType } from '../redux/types';
import { Store } from './createStore';
import { DomListener } from './DomListener';
import { Emitter } from './Emitter';

interface ExcelComponentClass {
  toHTML: () => string;
  prepare: () => void;
}

type OptionsType = {
  listeners?: string[];
  name: string;
  emitter?: Emitter;
  store: Store;
};

export class ExcelComponent extends DomListener implements ExcelComponentClass {
  name: string;
  emitter: Emitter;
  store: Store;
  storeSub: SubscribeType;
  private unsubscribers: ((args?: any) => any)[];

  constructor($root: any, options: OptionsType) {
    super($root, options?.listeners);
    this.name = options?.name;
    this.emitter = options?.emitter;
    this.store = options?.store;
    this.unsubscribers = [];
    this.prepare();
  }

  prepare() {

  }

  toHTML() {
    return '';
  }

  $emit(event: string, ...args: any): void {
    this.emitter.emit(event, ...args);
  }

  $on(event: string, callback: (args: any) => any) {
    const unsub = this.emitter.subscribe(event, callback);
    this.unsubscribers.push(unsub);
  }

  $dispatch(action: ActionType) {
    this.store.dispatch(action);
  }

  $subscribe(fn: (state?: StateType) => void) {
    this.storeSub = this.store.subscribe(fn);
  }

  init() {
    this.initDOMListeners();
  }

  destroy() {
    this.removeDOMListeners();
    this.unsubscribers.forEach(unsub => unsub());
    this.storeSub.unsubscribe();
  }
}
