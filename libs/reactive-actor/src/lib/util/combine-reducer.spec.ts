import { combineReducers } from 'from-reducer';
import { identity } from './identity';
import { startEvent } from './test/mock.data';

describe('combineReducers', () => {
  it('Should create a reducer from multiple reducers', () => {
    const initialState = {
      user: {
        active: false,
      },
      repositories: {
        active: false,
      },
    };

    const aReducer = jest.fn().mockImplementation(identity);

    const bReducer = jest.fn().mockImplementation(identity);

    const reducer = combineReducers({
      user: aReducer,
      repositories: bReducer,
    });

    reducer(initialState, startEvent);

    expect(aReducer).toHaveBeenCalledWith(initialState.user, startEvent);
    expect(bReducer).toHaveBeenCalledWith(
      initialState.repositories,
      startEvent
    );
  });

  it('Should return a reducer that outputs the state input when combineReducers is applied with an empty dictionary ({})', () => {
    const initialState = {
      user: {
        active: false,
      },
      repositories: {
        active: false,
      },
    };

    const reducer = combineReducers({});

    const state = reducer(initialState, startEvent);
    expect(state).toEqual(initialState);
  });
});
