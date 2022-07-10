import { ClientDataType } from 'core/Clients';
import { debounce } from 'core/utils';
import { StateType } from 'redux/types';

export class StateProcessor {
  private client: ClientDataType;

  constructor(client: ClientDataType, dalay = 300) {
    this.client = client;
    this.listen = debounce(this.listen.bind(this), dalay);
  }

  listen(state: StateType) {
    this.client.save(state);
  }

  get() {
    return this.client.get();
  }
}
