import { fromReducer } from '@benji-toolkit/from-reducer';
import {
  getUsers,
  userEpics,
  usersInitialState,
  usersReducer,
  UsersState,
} from '@benji-toolkit/users';
import React, { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';

const [state$, dispatch, combineEpics] = fromReducer(
  usersReducer,
  usersInitialState
);

export const Users = () => {
  const [state, setState] = useState<UsersState | null>(null);

  useEffect(() => {
    const subscription = new Subscription();
    const effects$ = combineEpics(...userEpics);

    subscription.add(state$.subscribe(setState));
    subscription.add(effects$.subscribe());

    dispatch(getUsers());

    return () => subscription.unsubscribe();
  }, [state$, dispatch]);

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
