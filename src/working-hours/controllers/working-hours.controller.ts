import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { WorkingHoursService } from "../services/working-hours.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles, RolesGuard } from "src/user/guards/roles.guard";
import { CurrentUserGuard } from "src/user/guards/current-user.guard";
import { Role } from "src/user/enums/role";
import { OwnerOrRoleGuard } from "../guards/owner-or-role.guard";
import { WorkingHours } from "../entities/working-hours";

@Controller("working-hours")
export class WorkingHoursController {
  constructor(private whService: WorkingHoursService) {}

  @Post("add")
  async add() {
    return await this.whService.addNew({ daysOff: 0, month: 5, numHours: 20, numOvertime: 0, year: 2023 });
  }

  @Get(":userId/current")
  @ApiBearerAuth("JWT-auth")
  @Roles(Role.ADMIN, Role.OPERATOR)
  @UseGuards(AuthGuard("jwt"), OwnerOrRoleGuard)
  async getMyCurrent() {
    return 1;
  }
}
