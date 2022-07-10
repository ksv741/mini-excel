export class Observer {
  private listeners: {
    [k: string]: Array<(args?: any) => any>
  };

  constructor() {
    this.listeners = {};
  }

  subscribe(eventName: string, callback: (args?: any) => any) {
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
