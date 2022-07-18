import { CallbackType } from 'redux/types';
import { initialStyleState } from 'src/constants';

export type SelectorType = string | HTMLElement | EventTarget | null;

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
      this.$el = selector as HTMLElement;
    }
  }

  html(html = '') {
    this.$el.innerHTML = html;

    return this;
  }

  set text(text: string) {
    if (!this.$el) return;

    if (!text) this.$el.innerText = '';
    this.$el.innerText = text;
  }

  get text() {
    if (this.$el.closest('input')) return (this.$el as HTMLInputElement).value;
    return (this.$el as HTMLElement).innerText || '';
  }

  clear() {
    this.html('');

    return this;
  }

  append(node: HTMLElement | Dom) {
    let child = node;

    if (node instanceof Dom) child = node.$el;

    if (this.$el.append) this.$el.append(child as HTMLElement);
    else this.$el.appendChild(child as HTMLElement);

    return this;
  }

  on(eventType: string, callback: CallbackType) {
    this.$el.addEventListener(eventType, callback);
  }

  off(eventType: string, callback: CallbackType) {
    this.$el.removeEventListener(eventType, callback);
  }

  focus() {
    this.$el.focus();
  }

  blur() {
    this.$el.blur();
  }

  get data() {
    return this.$el.dataset || '';
  }

  get dataValue(): string {
    return this.$el.dataset.value || '';
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

  css(styles: Partial<CSSStyleDeclaration>) {
    if (!styles) return;

    Object.keys(styles)?.forEach((key: any) => {
      this.$el.style[key] = styles[key] as string;
    });
  }

  addClass(className: string) {
    this.$el?.classList.add(className);
  }

  hasClass(className: string) {
    return Array.from(this.$el.classList).includes(className);
  }

  removeClass(className: string) {
    this.$el?.classList.remove(className);
  }

  getStyles(styles: string[]): Partial<CSSStyleDeclaration> {
    return styles.reduce((res, s) => {
      // replace all need if case style value have 2 or more word, this.$el.style[s] return ""word value""
      // for example font-family
      // @ts-ignore
      res[s] = this.$el.style[s].replaceAll('"', '') || initialStyleState[s];
      return res;
    }, {});
  }

  attr(name: string, value?: string) {
    if (value !== undefined) {
      this.$el.setAttribute(name, value);
      return this;
    }

    return this.$el.getAttribute(name);
  }

  removeChild($child: Dom) {
    this.$el.removeChild($child.$el);
  }

  replaceChild($newChild: Dom, $oldChild: Dom) {
    this.$el.replaceChild($newChild.$el, $oldChild.$el);
  }

  get isExist(): boolean {
    return !!this.$el;
  }

  isEqual($target: Dom | HTMLElement): boolean {
    if ($target instanceof Dom) return this.$el === $target.$el;

    return this.$el === $target;
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
