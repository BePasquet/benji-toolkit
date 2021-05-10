import React from 'react';
import { GlobalStateContext, gsCtx } from './store';
import { Users } from './users/users.component';

export const App = () => (
  <GlobalStateContext.Provider value={gsCtx}>
    <Users />
  </GlobalStateContext.Provider>
);

export default App;
