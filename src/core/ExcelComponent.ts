import { ActionType, CallbackType, StateType } from 'redux/types';
import { Dom } from 'core/Dom';
import { DomListener } from 'core/DomListener';
import { Observer } from 'core/Observer';
import { Store } from 'core/store/Store';

export type ComponentOptionsType = {
  eventListeners: string[];
  name: string;
  observer: Observer;
  store: Store;
  subscribe: (keyof StateType)[],
};

export abstract class ExcelComponent extends DomListener {
  private observer: Observer;
  public store: Store;
  private subscribe: (keyof StateType)[];
  private unsubscribers: CallbackType[];

  protected constructor($root: Dom, options: ComponentOptionsType) {
    super($root, options.eventListeners);
    this.name = options.name;
    this.observer = options.observer;
    this.store = options.store;
    this.subscribe = options.subscribe;

    this.unsubscribers = [];
    this.prepare();
  }

  prepare() {

  }

  toHTML() {
    return '';
  }

  $emitEventToObserver(event: string, args?: any): boolean {
    return this.observer?.emit(event, args);
  }

  $onEventFromObserver(event: string, callback: (args: any) => any) {
    const unsub = this.observer?.subscribe(event, callback);
    unsub && this.unsubscribers.push(unsub);
  }

  dispatchToStore(action: ActionType) {
    this.store?.dispatchToStore(action);
  }

  storeChanged(args: StateType) {
    console.log('CHANGE STORE: ', args, ' in component ', this.name);
  }

  isWatching(key: keyof StateType) {
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
