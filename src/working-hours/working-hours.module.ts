import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkingHours } from "./entities/working-hours";
import { WorkingHoursController } from "./controllers/working-hours.controller";
import { WorkingHoursService } from "./services/working-hours.service";
import { UserModule } from "src/user/user.module";
import { OwnerOrRoleGuard } from "./guards/owner-or-role.guard";
import { User } from "src/user/entities/user";

@Module({
  imports: [TypeOrmModule.forFeature([WorkingHours]), UserModule],
  controllers: [WorkingHoursController],
  providers: [WorkingHoursService, OwnerOrRoleGuard],
})
export class WorkingHoursModule {}
