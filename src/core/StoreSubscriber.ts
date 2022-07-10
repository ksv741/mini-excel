import { StateType } from 'redux/types';
import { Store } from 'core/store/Store';
import { isEqual } from 'core/utils';

export class StoreSubscriber {
  sub: any;
  currentState: StateType;

  constructor(private store: Store) {
    this.sub = null;
  }

  subscribeComponents(components: any[]) {
    this.currentState = this.store.getState();

    this.sub = this.store.subscribeToStore((newState: StateType) => {
      if (!newState) return;

      Object.keys(newState).forEach((key) => {
        if (!isEqual(this.currentState[key as keyof StateType], newState[key as keyof StateType])) {
          components.forEach(component => {
            if (component.isWatching(key)) {
              component.storeChanged({ [key]: newState[key as keyof StateType] });
            }
          });
        }
      });

      this.currentState = this.store.getState();
    });
  }

  unsubscribeFromStore() {
    this.sub.unsubscribe();
  }
}
