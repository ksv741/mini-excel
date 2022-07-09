export abstract class AbstractPage {
  params: any;

  constructor(params: any) {
    this.params = params || Date.now().toString();
  }

  getRoot() {

  }

  afterRender() {

  }

  destroy() {

  }
}
