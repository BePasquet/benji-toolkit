import { FromReducerProvider } from '@benji-toolkit/from-reducer-react-bindings';
import React from 'react';
import { appActor } from './app-actor';
import { Users } from './users/users.component';

export const App = () => (
  <FromReducerProvider actor={appActor}>
    <Users />
  </FromReducerProvider>
);

export default App;
