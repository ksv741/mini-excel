import { ActionType, CallbackType, ReducerType, StateType, SubscribeType } from 'redux/types';

export class Store {
  state: StateType | null;
  listeners: CallbackType[];

  constructor(private reducer: ReducerType, initialState: StateType) {
    this.state = reducer({ ...initialState }, { type: '__INIT__' });
    this.listeners = [];
  }

  subscribeToStore(fn: (state: StateType) => void): SubscribeType {
    this.listeners.push(fn);

    return {
      unsubscribe: () => {
        this.listeners = this.listeners.filter((l: any) => l !== fn);
      },
    };
  }

  dispatchToStore(action: ActionType) {
    if (!this.state || !action.type) return;

    this.state = this.reducer(this.state, action);
    this.listeners.forEach(listener => listener(this.state));
  }

  getState(): StateType {
    return JSON.parse(JSON.stringify(this.state));
  }
}
