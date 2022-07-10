import { StateType } from 'redux/types';
import { Store } from 'core/store/Store';
import { isEqual } from 'core/utils';

export class StoreSubscriber {
  sub: any;
  prevState: StateType;

  constructor(private store: Store) {
    this.sub = null;
    this.prevState = {};
  }

  subscribeComponents(components: any[]) {
    this.prevState = this.store.getState();

    this.sub = this.store.subscribeFromStore((state: StateType) => {
      if (!state) return;

      Object.keys(state).forEach(key => {
        if (!isEqual(this.prevState[key], state[key])) {
          components.forEach(component => {
            if (component.isWatching(key)) {
              const changes = { [key]: state[key] };
              component.storeChanged(changes);
            }
          });
        }
      });
      this.prevState = this.store.getState();
    });
  }

  unsubscribeFromStore() {
    this.sub.unsubscribe();
  }
}
