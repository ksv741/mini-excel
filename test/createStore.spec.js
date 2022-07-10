import { Store } from '../src/core/store/createStore';

const initialState = {
  count: 0,
};

const reducer = (state, action) => {
  if (action.type === 'ADD') {
    return { ...state, count: state.count + 1 };
  }

  return state;
};

describe('Create store', () => {
  let store;
  let handler;

  beforeEach(() => {
    store = new Store(reducer, initialState);
    handler = jest.fn();
  });

  test('should return store object', () => {
    expect(store).toBeDefined();
    expect(store.dispatchToStore).toBeDefined();
    expect(store.subscribeFromStore).toBeDefined();
    expect(store.getState).not.toBeUndefined();
  });

  test('should return object as a state', () => {
    expect(store.getState()).toBeInstanceOf(Object);
  });

  test('should return default state', () => {
    expect(store.getState()).toEqual(initialState);
  });

  test('should change state if actions exist', () => {
    store.dispatchToStore({ type: 'ADD' });
    expect(store.getState().count).toBe(1);
  });

  test("should NOT change state if actions don't exist", () => {
    store.dispatchToStore({ type: 'NOT_EXISTING_TYPE' });
    expect(store.getState().count).toBe(0);
  });

  test('should call subscriber', () => {
    store.subscribeFromStore(handler);
    store.dispatchToStore({ type: 'ADD' });

    expect(handler).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith(store.getState());
  });

  test('should NOT call sub if unsubscribe', () => {
    const unsub = store.subscribeFromStore(handler);
    unsub.unsubscribe();
    store.dispatchToStore({ type: 'ADD' });

    expect(handler).not.toHaveBeenCalled();
  });

  test('should dispatch in async way', () => {
    return new Promise(resolve => {
      setTimeout(() => {
        store.dispatchToStore({ type: 'ADD' });
      }, 500);

      setTimeout(() => {
        expect(store.getState().count).toBe(1);
        resolve();
      }, 1000);
    });
  });
});
