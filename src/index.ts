import { Excel } from './components/excel/Excel';
import { Formula } from './components/formula/Formula';
import { Header } from './components/header/Header';
import { Table } from './components/table/Table';
import { Toolbar } from './components/toolbar/Toolbar';
import './styles/index.scss';
import { Store } from './core/createStore';
import { debounce, storage } from './core/utils';
import { rootReducer } from './redux/rootReducer';
import { StateType } from './redux/types';

const store = new Store(rootReducer);

const stateListener = debounce((state: StateType) => {
  storage('excel-state', state);
}, 300);

store.subscribe(stateListener);

const excel = new Excel('#app', {
  components: [Header, Toolbar, Formula, Table],
  store,
});

excel.render();
