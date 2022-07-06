import { Excel } from 'components/excel/Excel';
import { Formula } from 'components/formula/Formula';
import { Header } from 'components/header/Header';
import { Table } from 'components/table/Table';
import { Toolbar } from 'components/toolbar/Toolbar';
import { Store } from 'core/createStore';
import { Page } from 'core/Page';
import { debounce, storage } from 'core/utils';
import { rootReducer } from 'redux/rootReducer';
import { StateType } from 'redux/types';
import { getNormalizeInitialState } from '../constants';

export function storageName(param: string) {
  return `excel:${param}`;
}

export class ExcelPage extends Page {
  private excel: Excel;

  getRoot() {
    const params = this.params[1] ? this.params[1] : Date.now().toString();
    const normalizeState = storage(storageName(params)) || getNormalizeInitialState(params);
    const store = new Store(rootReducer, normalizeState);

    const stateListener = debounce((state: StateType) => {
      storage(storageName(params), state);
    }, 300);

    store.subscribe(stateListener);

    this.excel = new Excel({
      components: [Header, Toolbar, Formula, Table],
      store,
    });

    return this.excel.getRoot();
  }

  afterRender() {
    this.excel.init();
  }

  destroy() {
    this.excel.destroy();
  }
}
