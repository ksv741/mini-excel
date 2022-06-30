import {
  ActionType, ReducerType, StateType, SubscribeType,
} from '../redux/types';
import { storage } from './utils';

const initialState: StateType = {
  colState: {},
  rowState: {},
  dataState: {},
  currentText: '',
  ...storage('excel-state'),
};

export class Store {
  static initialState = {};

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
