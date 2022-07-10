import { startCellId } from 'components/table/table.functions';
import { $, Dom } from 'core/Dom';

type CustomElementType = Element & { css: any };
type ResizeReturnDataType = { value: number, id: string, type: string };

export function resizeHandler($root: Dom, event: MouseEvent) {
  return new Promise<ResizeReturnDataType>(res => {
    const { target } = event;
    if (!(target as HTMLElement).dataset.resize) return;

    const $resizer = $(target as HTMLElement);
    const $parent = $resizer.closest('[data-type="resizable"]');
    const coords = $parent.getCoords();
    const type = $resizer.data.resize;

    const allCols = $root.findAll(`[data-col="${$parent.data.col}"]`);

    let delta: number;

    (Element.prototype as CustomElementType).css = function (styles: any) {
      Object.keys(styles).forEach((key: any) => {
        this.style[key] = styles[key];
      });
    };

    $resizer.css({ opacity: 1 });

    document.onmousemove = e => {
      document.body.style.userSelect = 'none';

      switch (type) {
        case 'col': {
          delta = e.pageX - coords.right;
          $resizer.css({
            right: `${-delta}px`,
            bottom: '-100vh',
          });

          break;
        }

        case 'row': {
          delta = e.pageY - coords.bottom;

          $resizer.css({
            bottom: `${-delta}px`,
            right: '-100vw',
          });

          break;
        }

        default: break;
      }
    };

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
      document.body.style.userSelect = '';

      let value = 0;
      const id = $parent.data[type || ''] || startCellId;

      switch (type) {
        case 'col': {
          value = coords.width + delta;

          $parent.css({ width: `${value}px` });
          allCols.forEach(el => $(el as HTMLElement).css({ width: `${coords.width + delta}px` }));
          break;
        }

        case 'row': {
          value = coords.height + delta;

          $parent.css({ height: `${value}px` });
          break;
        }

        default: return;
      }

      res({ value, id, type });

      $resizer.css({ opacity: 0, bottom: 0, right: 0 });
    };
  });
}
