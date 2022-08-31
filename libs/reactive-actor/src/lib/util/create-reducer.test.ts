import { createEvent } from './create-event';
import { createReducer } from './create-reducer';

interface LayoutState {
  loading: boolean;
  error: string;
}

const layoutInitialState: LayoutState = {
  loading: false,
  error: '',
};

const startLoader = createEvent('START_LOADER');

const stopLoader = createEvent('STOP_LOADER');

const showError = createEvent<string>('SHOW_ERROR');

const layoutReducer = createReducer(layoutInitialState, (builder) =>
  builder
    .addCase(startLoader, (state) => ({ ...state, loading: true }))
    .addCase(stopLoader, (state) => ({ ...state, loading: false }))
);

describe('createReducer', () => {
  it('Should create an event reducer that once is applied with a an event that is handled by the reducer will return the specified state', () => {
    const stateT1 = layoutReducer(layoutInitialState, startLoader(null));
    expect(stateT1).toEqual({ loading: true, error: '' });

    const stateT2 = layoutReducer(stateT1, stopLoader(null));
    expect(stateT2).toEqual({ loading: false, error: '' });
  });

  it('Should create an event reducer that once is applied with a an event that is not handled by the reducer will return the current state', () => {
    const stateT1 = layoutReducer(layoutInitialState, startLoader(null));
    expect(stateT1).toEqual({ loading: true, error: '' });

    const stateT2 = layoutReducer(stateT1, stopLoader(null));
    expect(stateT2).toEqual({ loading: false, error: '' });

    const stateT3 = layoutReducer(stateT2, showError('Test Error'));
    expect(stateT3).toEqual({ loading: false, error: '' });
  });
});
