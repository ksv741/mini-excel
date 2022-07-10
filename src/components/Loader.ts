import { $, Dom } from 'core/dom';

export function Loader(): Dom {
  return $.create('div', 'loader')
    .html('<div class="loader"><div class="lds-circle"><div></div></div></div>');
}
