import { $, Dom, SelectorType } from 'core/Dom';
import { ActiveRoute } from 'core/routes/ActiveRoute';
import { DashboardPage } from 'pages/DashboardPage';
import { ExcelPage } from 'pages/ExcelPage';
import { Loader } from 'components/Loader';

type RoutesType = {
  dashboard: typeof DashboardPage
  excel: typeof ExcelPage
};

export class Router {
  private $placeholder: Dom;
  private routes: RoutesType;
  private page: DashboardPage | ExcelPage;
  private loader: Dom;

  constructor(selector: SelectorType, routes: RoutesType) {
    if (!selector) throw new Error('Selector not provided');

    this.$placeholder = $(selector);
    this.routes = routes;
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
    this.page?.destroy();
    this.$placeholder.clear().append(this.loader);

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
    this.page = new Page(ActiveRoute.param);

    const root = await this.page.getRoot();

    this.$placeholder.clear().append(root);

    this.page.afterRender();
  }

  destroy() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    window.removeEventListener('hashchange', this.changePageHandler);
  }
}
