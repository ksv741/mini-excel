import { $, Dom } from '../../core/dom';

interface ExcelOptionsType {
  components: any[]
}

export class Excel {
  $el: HTMLElement | Dom;
  components: any[];

  constructor(selector: string, options: ExcelOptionsType) {
    this.$el = $(selector);
    this.components = options.components;

    console.log(`Created new Excel class in ${selector} with options: ${options}`);
  }

  getRoot() {
    const $root = $.create('div', 'excel');

    this.components = this.components.map(Component => {
      const $el = $.create('div', Component.className);
      const component: any = new Component($el);

      $el.html(component.toHTML());
      $root.append($el.$el);

      return component;
    });

    return $root.$el;
  }

  render() {
    this.$el.append(this.getRoot());
    this.components.forEach(component => component.init());
  }
}
