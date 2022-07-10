import { AbstractPage } from 'pages/AbstractPage';
import { Excel } from 'components/excel/Excel';
import { Formula } from 'components/formula/Formula';
import { Header } from 'components/header/Header';
import { LocalStorageClient } from 'core/Clients';
import { StateProcessor } from 'core/StateProcessor';
import { Store } from 'core/store/Store';
import { SubscribeType } from 'redux/types';
import { Table } from 'components/table/Table';
import { Toolbar } from 'components/toolbar/Toolbar';
import { rootReducer } from 'redux/rootReducer';

export function storageName(param: string) {
  return `excel:${param}`;
}

export class ExcelPage extends AbstractPage {
  private excel: Excel;
  private storeSub: SubscribeType | null;
  private processor: StateProcessor;

  constructor(props: any) {
    super(props);

    this.storeSub = null;
    this.processor = new StateProcessor(
      new LocalStorageClient(this.params[1]),
    );
  }

  async getRoot() {
    const state = await this.processor.get();
    const store = new Store(rootReducer, state);

    this.storeSub = store.subscribeFromStore(this.processor.listen);

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
    this.storeSub?.unsubscribe();
  }
}
