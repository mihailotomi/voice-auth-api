import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkingHours } from "./entities/working-hours";
import { WorkingHoursController } from "./controllers/working-hours.controller";
import { WorkingHoursService } from "./services/working-hours.service";
import { UserModule } from "src/user/user.module";
import { User } from "src/user/entities/user";
import { WhIdExistsConstraint } from "./constraints/wh-id-exists.constraint";
import { DateCompareConstraint } from "./constraints/date-compare.constraint";
import { NumberCompareConstraint } from "./constraints/number-compare.constraint";

@Module({
  imports: [TypeOrmModule.forFeature([WorkingHours]), UserModule],
  controllers: [WorkingHoursController],
  providers: [WorkingHoursService, WhIdExistsConstraint, DateCompareConstraint, NumberCompareConstraint],
})
export class WorkingHoursModule {}
