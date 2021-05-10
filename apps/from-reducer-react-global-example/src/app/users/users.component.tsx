import { getRepositories } from '@benji-toolkit/repositories';
import { getUsers } from '@benji-toolkit/users';
import React, { useContext, useEffect, useState } from 'react';
import { GlobalState, GlobalStateContext } from '../store';

export const Users = () => {
  const [state, setState] = useState<GlobalState | null>(null);
  const { state$, dispatch } = useContext(GlobalStateContext);

  useEffect(() => {
    const subscription = state$.subscribe(setState);
    dispatch(getUsers());
    dispatch(getRepositories());

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
