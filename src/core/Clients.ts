import { storage } from 'core/utils';
import { storageName } from 'pages/ExcelPage';
import { StateType } from 'redux/types';
import { getNormalizeInitialState } from '../constants';

export class LocalStorageClient {
  private name: string;

  constructor(name: string) {
    this.name = storageName(name);
  }

  save(state: StateType): Promise<void> {
    storage(this.name, state);
    return Promise.resolve();
  }

  get() {
    const data = storage(this.name) || getNormalizeInitialState(this.name);

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(data);
      }, 1500);
    });
  }
}
