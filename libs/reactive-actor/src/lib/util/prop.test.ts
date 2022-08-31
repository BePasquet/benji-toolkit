import { prop } from './prop';

interface TestState {
  loaded: boolean;
}

describe('prop', () => {
  it('Should return a function that once applied the output will be the value of the specified property of the object', () => {
    const testState: TestState = {
      loaded: true,
    };

    const selector = prop<TestState>('loaded');

    expect(selector(testState)).toBe(testState.loaded);
  });
});
