type SelectorType = string | HTMLElement;

export interface DomClass {
  html(html?: string): string | DomClass;
  clear(): DomClass;
  append(node: Node | string | DomClass): DomClass
}

export class Dom implements DomClass {
  $el: HTMLElement;

  constructor(selector: SelectorType) {
    this.$el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
  }

  html(html = '') {
    if (typeof html === 'string') {
      this.$el.innerHTML = html;
      return this;
    }

    return this.$el.outerHTML.trim();
  }

  set text(text: string) {
    this.$el.textContent = text;
  }

  get text() {
    return this.$el.textContent;
  }

  clear() {
    this.html('');

    return this;
  }

  // FIXME: any
  append(node: any) {
    let child = node;

    if (node instanceof Dom) child = node.$el;

    if (Element.prototype.append) {
      this.$el.append(child);
    } else {
      this.$el.appendChild(child);
    }

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
    return this.$el.dataset;
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
    Object.keys(styles).forEach((key: any) => {
      this.$el.style[key] = styles[key];
    });
  }

  addClass(className: string) {
    this.$el?.classList.add(className);
  }

  removeClass(className: string) {
    this.$el?.classList.remove(className);
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
