import { USER_ROLE } from './user-role.enum';
import { User } from './user.entity';

export class DUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: USER_ROLE;
  lastLoginTime: Date;
  createdAt: Date;

  token: string;

  constructor(user: User, token?: string) {
    this.id = user.id;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.role = user.role;
    this.lastLoginTime = user.lastLoginTime;
    this.createdAt = user.createdAt;
    this.token = token;
  }
}
