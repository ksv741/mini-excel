import { $, Dom } from 'core/Dom';
import { AbstractPage } from 'pages/AbstractPage';
import { storage } from 'core/utils';

export class DashboardPage extends AbstractPage {
  getRoot(): Dom {
    const id = Date.now().toString();

    return $.create('div', 'db').html(
      `
        <div class="db__header">
          <h1>Excel Панель управыления</h1>
        </div>
        <div class="db__new">
          <div class="db__view">
            <a href="#excel/${id}" class="db__create">Новая таблица</a>
          </div>
        </div>
        <div class="db__table db__view">
          ${createRecordsTable()}
        </div>
      `,
    );
  }
}

function toHtml(key: string): string {
  const params = +key.split(':')[1];
  const state = storage(key);
  const link = `#excel/${params}`;
  const date = new Date(+state.openDate);

  return `
    <li class="db__record">
      <a href=${link}>${state.title}</a>
      <strong>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</strong>
    </li>
  `;
}

export function createRecordsTable(): string {
  const keys = getAllKeys();
  if (!keys.length) return '<p>Пока не создали ни одной таблицы</p>';

  return `
    <div class="db__list-header">
      <span>Название</span>
      <span>Дата открытия</span>
    </div>
    
    <ul class="db__list">
      ${keys.map((key) => toHtml(key)).join('')}
    </ul>
  `;
}

function getAllKeys() {
  const keys = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.includes('excel')) continue;

    keys.push(key);
  }

  return keys;
}
