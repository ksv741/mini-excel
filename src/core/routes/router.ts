import { $, Dom, SelectorType } from 'core/dom';
import { ActiveRoute } from 'core/routes/ActiveRoute';
import { Loader } from 'components/Loader';
import { DashboardPage } from 'pages/DashboardPage';
import { ExcelPage } from 'pages/ExcelPage';

type RoutesType = {
  dashboard: typeof DashboardPage
  excel: typeof ExcelPage
};

export class Router {
  private $placeholder: Dom;
  private routes: RoutesType;
  private page: DashboardPage | ExcelPage | null;
  private loader: Dom;

  constructor(selector: SelectorType, routes: RoutesType) {
    if (!selector) throw new Error('Selector not provided');

    this.$placeholder = $(selector);
    this.routes = routes;
    this.page = null;
    this.loader = Loader();

    this.changePageHandler = this.changePageHandler.bind(this);

    this.init();
  }

  init() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    window.addEventListener('hashchange', this.changePageHandler);
    this.changePageHandler();
  }

  async changePageHandler() {
    this.$placeholder.clear().append(this.loader);
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

    const root = await this.page?.getRoot();

    this.$placeholder.clear().append(root);

    this.page?.afterRender();
  }

  destroy() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    window.removeEventListener('hashchange', this.changePageHandler);
  }
}
