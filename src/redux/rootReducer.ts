import { TABLE_RESIZE } from './constants';
import { ActionType, StateType } from './types';

export function rootReducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case TABLE_RESIZE: {
      const newState: StateType = { ...state };
      const fieldName = `${action.resizeData?.type}State`;

      newState[fieldName][action.resizeData?.id] = action.resizeData?.value;

      return { ...state, ...newState };
    }

    default: return state;
  }
}
