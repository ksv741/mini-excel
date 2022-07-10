import { startCellId } from 'components/table/table.functions';
import { storage } from 'core/utils';
import { storageName } from 'pages/ExcelPage';
import { StateType } from 'redux/types';
import { getNormalizeInitialState } from 'src/constants';

export interface ClientDataType {
  save: (state: StateType) => Promise<any>;
  get: () => Promise<any>;
}

export class LocalStorageClient implements ClientDataType {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  save(state: StateType): Promise<void> {
    storage(storageName(this.name), state);
    return Promise.resolve();
  }

  get() {
    const data = this.norm(storage(storageName(this.name))) || getNormalizeInitialState(this.name);

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(data);
      }, 1500);
    });
  }

  norm(state) {
    return {
      ...state,
      currentStyles: { ...state.stylesState?.[startCellId] },
      currentText: state.dataState?.[startCellId],
    };
  }
}
