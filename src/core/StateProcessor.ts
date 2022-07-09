import { debounce } from 'core/utils';

export class StateProcessor {
  constructor(client, dalay = 300) {
    this.client = client;
    this.listen = debounce(this.listen.bind(this), dalay);
  }

  listen(state) {
    this.client.save(state);
  }

  get() {
    return this.client.get();
  }
}
