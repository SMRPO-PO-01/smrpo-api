import { randomBytes } from 'crypto';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { hash } from '../../utils/hash';
import { USER_ROLE } from './user-role.enum';
import { VUser } from './user.validation';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  role: USER_ROLE;

  @Column('timestamptz', { nullable: true })
  lastLoginTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  constructor(user?: VUser) {
    if (user) {
      this.username = user.username;
      this.salt = randomBytes(10).toString('hex');
      this.password = hash(this.salt + user.password);
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.email = user.email;
      this.role = user.role;
    }
  }
}
