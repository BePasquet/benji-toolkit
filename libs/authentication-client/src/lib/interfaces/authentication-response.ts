import { User } from './user.interface';

export interface AuthenticationResponse {
  user: User;
  token: string;
}
