import {
  useDispatch,
  useSelector,
} from '@benji-toolkit/reactive-actor-bindings';
import { getRepositories } from '@benji-toolkit/repositories';
import { getUsers } from '@benji-toolkit/users';
import React, { useEffect } from 'react';

export const Users = () => {
  const dispatch = useDispatch();
  const state = useSelector((x) => x);

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getRepositories());
  }, [dispatch]);

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
