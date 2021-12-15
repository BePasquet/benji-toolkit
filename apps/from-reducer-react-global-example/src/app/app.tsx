import { FromReducerProvider } from '@benji-toolkit/from-reducer-react-bindings';
import React from 'react';
import { store } from './store';
import { Users } from './users/users.component';

export const App = () => (
  <FromReducerProvider store={store}>
    <Users />
  </FromReducerProvider>
);

export default App;
