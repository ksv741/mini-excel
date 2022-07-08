/**
 * @jest-environment jsdom
 */

import { Router } from './router';
import { Page } from '../Page';

class DashboardPage extends Page {
  getRoot() {
    const root = document.createElement('div');
    root.innerHTML = 'dashboard';

    return root;
  }
}
class ExcelPage extends Page {}

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

  test('should render Dasboard Page', () => {
    router.changePageHandler();
    expect($root.innerHTML).toBe('<div>dashboard</div>');
  });
});
