import { storage } from 'core/utils';

function toHtml(key: string) {
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

export function createRecordsTable() {
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
    if (!key.includes('excel')) continue;

    keys.push(key);
  }

  return keys;
}
