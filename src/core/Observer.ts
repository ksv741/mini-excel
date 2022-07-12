import { CallbackType } from 'redux/types';

export class Observer {
  private readonly listeners: {
    [k: string]: Array<CallbackType>
  };

  constructor() {
    this.listeners = {};
  }

  subscribe(eventName: string, callback: CallbackType) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(callback);

    return () => {
      this.listeners[eventName] = this.listeners[eventName].filter(listener => listener !== callback);
    };
  }

  emit(eventName: string, args: any[]) {
    if (!Array.isArray(this.listeners[eventName])) return false;

    this.listeners[eventName].forEach(listener => listener(args));

    return true;
  }
}
