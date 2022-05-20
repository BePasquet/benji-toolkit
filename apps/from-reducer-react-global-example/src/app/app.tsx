import { ReactiveActorProvider } from '@benji-toolkit/reactive-actor-bindings';
import React from 'react';
import { appActor } from './app-actor';
import { Users } from './users/users.component';

export const App = () => (
  <ReactiveActorProvider actor={appActor}>
    <Users />
  </ReactiveActorProvider>
);

export default App;
