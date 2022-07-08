import { DashboardPage } from 'pages/DashboardPage';
import { ExcelPage } from 'pages/ExcelPage';
import { $, Dom, SelectorType } from 'core/dom';
import { ActiveRoute } from './ActiveRoute';

type RoutesType = {
  dashboard: DashboardPage
  excel: ExcelPage
};

export class Router {
  private $placeholder: Dom;
  private routes: RoutesType;
  private page: DashboardPage | ExcelPage | null;

  constructor(selector: SelectorType, routes: RoutesType) {
    if (!selector) throw new Error('Selector not provided');

    this.$placeholder = $(selector);
    this.routes = routes;
    this.page = null;

    this.changePageHandler = this.changePageHandler.bind(this);

    this.init();
  }

  init() {
    window.addEventListener('hashchange', this.changePageHandler);
    this.changePageHandler();
  }

  changePageHandler() {
    this.$placeholder.clear();
    this.page?.destroy();

    let Page;

    switch (true) {
      case ActiveRoute.path.includes('excel'):
        Page = this.routes.excel;
        break;

      case ActiveRoute.path.includes('dashboard'):
      default:
        Page = this.routes.dashboard;
        break;
    }
    // @ts-ignore
    this.page = new Page(ActiveRoute.param);

    this.$placeholder.append(this.page?.getRoot());
    this.page?.afterRender();
  }

  destroy() {
    window.removeEventListener('hashchange', this.changePageHandler);
  }
}
