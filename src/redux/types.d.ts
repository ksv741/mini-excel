export type ActionType = {
  type: string
  [k: string]: any
};

export type StateType = {
  [k: string]: any
};

export type ReducerType = (state: StateType, action: ActionType) => StateType;

export type SubscribeType = {
  unsubscribe: () => void
};
