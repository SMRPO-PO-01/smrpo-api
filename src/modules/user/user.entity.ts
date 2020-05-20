import { randomBytes } from 'crypto';
import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { hash } from '../../utils/hash';
import { Project } from '../project/project.entity';
import { Task } from '../task/task.entity';
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

  @Column({ default: false })
  deleted: boolean;

  @Column('timestamptz', { nullable: true })
  lastLoginTime: Date;

  @Column('timestamptz', { nullable: true })
  currentLoginTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(
    () => Project,
    p => p.scrumMaster,
  )
  projects_sm: Project[];

  @OneToMany(
    () => Project,
    p => p.projectOwner,
  )
  projects_po: Project[];

  @ManyToMany(
    () => Project,
    p => p.developers,
  )
  projects: Project[];

  @OneToMany(
    () => Task,
    task => task.user,
    { nullable: true },
  )
  tasks: Task[];

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
