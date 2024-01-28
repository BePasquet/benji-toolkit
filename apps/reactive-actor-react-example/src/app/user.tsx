import {
  AuthenticationClient,
  Storage,
} from '@benji-toolkit/authentication-client';
import axios from 'axios';
import { environment } from '../environments/environment';

export const httpClient = axios.create({
  baseURL: environment.API_URI,
});

const authenticationClient = new AuthenticationClient(
  httpClient,
  new Storage()
);

authenticationClient.state$.subscribe(console.log);

authenticationClient.verifyAuth();

export function User() {
  return <div>User</div>;
}
