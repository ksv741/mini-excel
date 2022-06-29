import { TABLE_RESIZE } from './constants';

export function tableResize(resizeData: any) {
  return {
    type: TABLE_RESIZE,
    ...resizeData,
  };
}
