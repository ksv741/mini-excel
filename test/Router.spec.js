/**
 * @jest-environment jsdom
 */

import { Router } from '../src/core/routes/Router';
import { AbstractPage } from '../src/pages/AbstractPage';

class DashboardPage extends AbstractPage {
  getRoot() {
    const root = document.createElement('div');
    root.innerHTML = 'dashboard';

    return root;
  }
}
class ExcelPage extends AbstractPage {}

describe('Router:', () => {
  let router;
  let $root;

  beforeEach(() => {
    $root = document.createElement('div');
    router = new Router($root, {
      excel: ExcelPage,
      dashboard: DashboardPage,
    });
  });

  test('should be defined', () => {
    expect(router).toBeDefined();
  });

  // TODO Loader
  // test('should render Dasboard Page', () => {
  //   router.changePageHandler();
  //   expect($root.innerHTML).toBe('<div>dashboard</div>');
  // });
});
