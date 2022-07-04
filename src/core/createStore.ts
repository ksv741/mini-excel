import { initialState } from '../constants';
import { ActionType, ReducerType, StateType, SubscribeType } from '../redux/types';

export class Store {
  state: StateType;
  listeners: ((args?: any) => void)[];

  constructor(private reducer: ReducerType) {
    this.state = reducer({ ...initialState }, { type: '__INIT__' });
    this.listeners = [];
  }

  subscribe(fn: (state?: StateType) => void): SubscribeType {
    this.listeners.push(fn);
    return {
      unsubscribe() {
        this.listeners = this.listeners.filter((l: any) => l !== fn);
      },
    };
  }

  dispatch(action: ActionType) {
    this.state = this.reducer(this.state, action);
    this.listeners.forEach(listener => listener(this.state));
  }

  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }
}
