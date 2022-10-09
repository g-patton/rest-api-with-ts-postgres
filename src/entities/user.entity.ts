import { argv } from 'process';
import { Entity, Column, Index } from 'typeorm';
import Model from './model.entity';

export enum RoleEnumType {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User extends Model {
  @Column()
  name: string;

  @Index('email_index')
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: RoleEnumType,
    default: RoleEnumType.USER,
  })
  role: RoleEnumType.USER;

  @Column({
    default: 'default.png',
  })
  photo: string;

  @Column({
    default: false,
  })
  verified: boolean;

  toJSON() {
    return { ...this, password: undefined, verified: undefined };
  }
}

// used users as name of user table by passing user as an arg.
// no two users should have same email address
// @index('email_index') tells Postgres to assign index to email column

