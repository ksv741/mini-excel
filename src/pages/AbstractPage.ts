export abstract class AbstractPage {
  params: string[];

  constructor(params: string[]) {
    this.params = params || Date.now().toString();
  }

  getRoot() {

  }

  afterRender() {

  }

  destroy() {

  }
}
