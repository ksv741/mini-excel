import { storage, storageName } from 'core/utils';
import { StateType } from 'redux/types';
import { getNormalizeInitialState } from 'src/constants';

export interface ClientDataType {
  save: (state: StateType) => Promise<void>;
  get: () => Promise<StateType>;
}

export class LocalStorageClient implements ClientDataType {
  private readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  save(state: StateType): Promise<void> {
    storage(storageName(this.name), state);
    return Promise.resolve();
  }

  get(): Promise<StateType> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(getNormalizeInitialState(this.name));
      }, 1500);
    });
  }
}
