export function capitalize(string: string): string {
  if (!string) return '';

  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function storage(key: string, data: any = null): any {
  if (!data) {
    const localData = localStorage.getItem(key);
    return localData ? JSON.parse(localData) : false;
  }

  localStorage.setItem(key, JSON.stringify(data));

  return true;
}

export function isEqual(a: any, b: any) {
  if (typeof a === 'object' && typeof b === 'object') {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  return a === b;
}

export function debounce(fn: (fnArgs?: any) => void, wait: number) {
  let timeout: NodeJS.Timeout;

  return function (...args: any) {
    const later = () => {
      clearTimeout(timeout);
      fn.apply(this, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function parse(value: string) {
  if (value.startsWith('=')) {
    try {
      // eslint-disable-next-line no-eval
      return eval(value.slice(1));
    } catch (e) {
      return value;
    }
  }

  return value;
}
