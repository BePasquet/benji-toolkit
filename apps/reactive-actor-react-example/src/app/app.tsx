import { stop } from '@benji-toolkit/reactive-actor';
import {
  getUsers,
  UsersActor,
  usersInitialState,
  UsersState,
} from '@benji-toolkit/users';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export function App() {
  const [state, setState] = useState<UsersState>(usersInitialState);
  const usersActor = useRef(new UsersActor()).current;

  useEffect(() => {
    const subscription = usersActor.state$.subscribe(setState);

    return () => {
      subscription.unsubscribe();
      usersActor.send(stop(null));
    };
  }, [usersActor]);

  const fetchUsers = () => usersActor.send(getUsers(null));

  return (
    <StyledApp>
      <h1>Reactive Actor React Example</h1>
      <div>
        <button onClick={fetchUsers}>Fetch users</button>
      </div>

      <code>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </code>
    </StyledApp>
  );
}

export default App;

const StyledApp = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  flex: 1;

  h1 {
    text-align: center;
  }

  button {
    margin-bottom: 20px;
    padding: 8px 16px;
    background-color: #3f51b5;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  code {
    width: 100%;
    padding: 20px;
    background-color: #eee;
    font-family: monospace;
  }
`;
