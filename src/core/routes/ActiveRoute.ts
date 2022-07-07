export class ActiveRoute {
  static get path() {
    return window.location.hash.slice(1);
  }

  static get param() {
    return window.location.hash.split('/');
  }

  static set navigateTo(path: string) {
    window.location.hash = path;
  }
}
