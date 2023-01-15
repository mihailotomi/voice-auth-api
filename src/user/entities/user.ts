import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Gender } from './gender';
import { Role } from './role';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
  })
  id: number;

  @Column({
    nullable: false,
    length: 30,
  })
  firstName: string;

  @Column({
    nullable: false,
    length: 30,
  })
  lastName: string;

  @Column({
    nullable: false,
    type: 'char',
    length: 13,
    unique: true,
  })
  identifier: string;

  @Column({
    nullable: false,
    length: 50,
    unique: true,
  })
  username: string;

  @Column({ nullable: false, type: 'text' })
  password: string;

  @Column({
    nullable: false,
    enum: Role,
    type: 'smallint',
  })
  role: Role;

  @Column({
    nullable: false,
    enum: Gender,
    type: 'smallint',
  })
  gender: Gender;
}
