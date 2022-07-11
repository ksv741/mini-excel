import { ToolbarStateType } from 'components/toolbar/toolbar-types';
import { initialStyleState } from 'src/constants';

export type SelectorType = string | HTMLElement;

export interface DomClass {
  html(html?: string): string | DomClass;
  clear(): DomClass;
  append(node: Node | string | DomClass): DomClass
}

export class Dom implements DomClass {
  $el: HTMLElement;

  constructor(selector: SelectorType) {
    // Could not find element with selector in DOM, need a check
    if (typeof selector === 'string') {
      const elementFromDOM = document.querySelector(selector);
      if (!elementFromDOM) throw new Error(`Can't find element with "${selector}" selector`);
      else this.$el = elementFromDOM as HTMLElement;
    } else {
      this.$el = selector;
    }
  }

  html(html = '') {
    this.$el.innerHTML = html;

    return this;
  }

  set text(text: string) {
    if (!text) this.$el.textContent = '';
    this.$el.textContent = text;
  }

  get text() {
    if (this.$el.closest('input')) return (this.$el as HTMLInputElement).value;
    return (this.$el as HTMLElement).innerText;
  }

  clear() {
    this.html('');

    return this;
  }

  // FIXME: any
  append(node: any) {
    let child = node;

    if (node instanceof Dom) child = node.$el;

    if (this.$el.append) this.$el.append(child);
    else this.$el.appendChild(child);

    return this;
  }

  on(eventType: string, callback: any) {
    this.$el.addEventListener(eventType, callback);
  }

  off(eventType: string, callback: any) {
    this.$el.removeEventListener(eventType, callback);
  }

  focus() {
    this.$el.focus();
  }

  get data() {
    return this.$el.dataset || '';
  }

  setData(name: string, value: string) {
    this.$el.setAttribute(`data-${name}`, value);
  }

  closest(selector: string) {
    return $(this.$el.closest(selector) as HTMLElement);
  }

  getCoords() {
    return this.$el.getBoundingClientRect();
  }

  find(selector: string): Dom {
    return $(this.$el.querySelector(selector) as HTMLElement);
  }

  findAll(selector: string) {
    return this.$el.querySelectorAll(selector);
  }

  css(styles: any) {
    if (!styles) return;

    Object.keys(styles)?.forEach((key: any) => {
      this.$el.style[key] = styles[key];
    });
  }

  addClass(className: string) {
    this.$el?.classList.add(className);
  }

  removeClass(className: string) {
    this.$el?.classList.remove(className);
  }

  getStyles(styles: any[]) {
    return styles.reduce((res, s) => {
      // replace all need if case style value have 2 or more word, this.$el.style[s] return ""word value""
      // for example font-family
      res[s] = this.$el.style[s].replaceAll('"', '') || initialStyleState[s as keyof ToolbarStateType];
      return res;
    }, {});
  }

  attr(name: string, value: string) {
    if (value) {
      this.$el.setAttribute(name, value);
      return this;
    }

    return this.$el.getAttribute(name);
  }
}

export function $(selector: SelectorType) {
  return new Dom(selector);
}

$.create = (tagName: string, classes = '') => {
  const el: HTMLElement = document.createElement(tagName);
  if (classes) el.classList.add(classes);

  return $(el);
};
