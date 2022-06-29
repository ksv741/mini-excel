import { TABLE_RESIZE } from './constants';
import { ActionType, StateType } from './types';

export function rootReducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case TABLE_RESIZE: {
      const prevState = state.colState || {};
      prevState[action.resizeData?.id] = action.resizeData?.value;
      return { ...state, colState: prevState };
    }

    default: return state;
  }
}
