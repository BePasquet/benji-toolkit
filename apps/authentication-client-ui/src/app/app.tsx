// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from 'axios';

import {
  AuthenticationClient,
  Storage,
} from '@benji-toolkit/authentication-client';
import { filter, tap } from 'rxjs';
import { environment } from '../environments/environment.prod';
import NxWelcome from './nx-welcome';

export const httpClient = axios.create({
  baseURL: environment.API_URI,
});

const authenticationClient = new AuthenticationClient(
  httpClient,
  new Storage()
);

authenticationClient.addAuthInterceptor();

const loginWhenNotVerified$ = authenticationClient.state$.pipe(
  filter(({ verified, loading, user }) => verified && !loading && !user),
  tap(() =>
    authenticationClient.login({
      email: 'admin@smartcam.com',
      password: 'Qwerty123',
    })
  )
);

authenticationClient.state$.subscribe(console.log);
loginWhenNotVerified$.subscribe();

authenticationClient.verifyAuth();

export function App() {
  return (
    <div>
      <NxWelcome title="authentication-client-ui" />
    </div>
  );
}

export default App;
