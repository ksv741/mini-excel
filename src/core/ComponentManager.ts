import { BaseComponentOption, ComponentType } from 'components/excel/Excel';
import { $, Dom } from 'core/Dom';
import { ExcelComponent } from 'core/ExcelComponent';

export class ComponentManager {
  private components: ExcelComponent[];
  private componentConstructors: {
    [k: string]: ComponentType;
  };
  public $rootExcelElement: Dom;

  constructor() {
    this.componentConstructors = {};
    this.$rootExcelElement = $.create('div', 'excel');
    this.components = [];
    // for debug
    // @ts-ignore
    window.componentRoots = this.componentConstructors;
  }

  createComponent(Component: ComponentType, componentOptions: BaseComponentOption) {
    const $el = $.create('div', Component.className);
    const componentInstance: ExcelComponent = new Component($el, componentOptions);

    $el.html(componentInstance.toHTML());

    this.componentConstructors[componentInstance.name] = Component;
    this.components.push(componentInstance);

    return componentInstance;
  }

  addComponentsToRoot(components: ExcelComponent[]) {
    components.forEach(component => this.$rootExcelElement.append(component.$root));
  }

  rerenderComponent(component: ExcelComponent) {
    const componentConstructor = this.findComponentConstructor(component);
    const componentOptions: BaseComponentOption = {
      observer: component.observer,
      store: component.store,
      componentManager: this,
    };
    const $newComponent = this.createComponent(componentConstructor, componentOptions);

    this.$rootExcelElement.replaceChild($newComponent.$root, component.$root);
    component.destroy();
    $newComponent.afterRender();
  }

  findComponentConstructor(component: ExcelComponent): ComponentType {
    return this.componentConstructors[component.name];
  }

  destroyComponents() {
    Object.values(this.components).forEach(component => component.destroy());
  }
}
