import { authenticationClient } from './authentication-client';

describe('authenticationClient', () => {
  it('should work', () => {
    expect(authenticationClient()).toEqual('authentication-client');
  });
});
