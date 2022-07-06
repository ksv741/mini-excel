import { storage } from 'core/utils';

function toHtml(key: string) {
  const date = +key.split(':')[1];
  const params = storage(key);
  const link = `#excel/${date}`;
  return `
    <li class="db__record">
      <a href=${link}>${params.title}</a>
      <strong>${new Date(date).toLocaleDateString()}</strong>
    </li>
  `;
}

export function getAllRecords() {

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
