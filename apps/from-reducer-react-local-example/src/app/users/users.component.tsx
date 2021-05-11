import {
  getUsers,
  userEpics,
  usersInitialState,
  usersReducer,
  UsersState,
} from '@benji-toolkit/users';
import { fromReducer } from 'from-reducer';
import React, { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';

export const Users = () => {
  const [state, setState] = useState<UsersState | null>(null);

  useEffect(() => {
    const [state$, dispatch, combineEpics] = fromReducer(
      usersReducer,
      usersInitialState
    );

    const subscriptions = new Subscription();
    const effects$ = combineEpics(...userEpics);

    subscriptions.add(state$.subscribe(setState));
    subscriptions.add(effects$.subscribe());

    dispatch(getUsers());

    return () => subscriptions.unsubscribe();
  }, []);

  return (
    !!state && (
      <div>
        <pre>
          <code>{JSON.stringify(state, null, 2)}</code>
        </pre>
      </div>
    )
  );
};
