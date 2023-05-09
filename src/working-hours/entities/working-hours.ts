import { User } from "src/user/entities/user";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WorkingHours {
  @PrimaryGeneratedColumn({
    type: "bigint",
    name: "hours_id",
  })
  id: number;

  @Column({ nullable: false })
  month: number;

  @Column({ nullable: false })
  year: number;

  @Column({ nullable: false, name: "num_hours" })
  numHours: number;

  @Column({ nullable: false, name: "num_overtime" })
  numOvertime: number;

  @Column({ nullable: false, name: "days_off" })
  daysOff: number;

  @ManyToOne(() => User, (user) => user.workingHoursHistory)
  @JoinColumn({ name: "user_id" })
  user: User;
}
