import { CHANGE_TEXT, TABLE_RESIZE } from './constants';

export function tableResize(resizeData: any) {
  return {
    type: TABLE_RESIZE,
    ...resizeData,
  };
}

export function changeText(data: { text: string, id: string }) {
  return {
    type: CHANGE_TEXT,
    data,
  };
}
