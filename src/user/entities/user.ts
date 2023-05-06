import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Gender } from "../enums/gender";
import { Role } from "../enums/role";
import { UserStatus } from "../enums/user-status";
import { Exclude } from "class-transformer";
import { WorkingHours } from "src/working-hours/entities/working-hours";

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: "bigint",
    name: "user_id",
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
    length: 50,
  })
  email: string;

  @Column({
    nullable: false,
    type: "char",
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

  @Exclude()
  @Column({ nullable: false, type: "text" })
  password: string;

  @Column({
    nullable: false,
    enum: Role,
    type: "smallint",
  })
  role: Role;

  @Column({
    nullable: false,
    enum: Gender,
    type: "smallint",
  })
  gender: Gender;

  @Column({
    nullable: false,
    enum: UserStatus,
    type: "smallint",
  })
  status: UserStatus;

  @OneToMany(() => WorkingHours, (workingHours) => workingHours.user)
  workingHoursHistory: WorkingHours[];
}
