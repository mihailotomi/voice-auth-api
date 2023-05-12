import { Controller, Get, Param, Post, Query, Request, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { WorkingHoursService } from "../services/working-hours.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles, RolesGuard } from "src/user/guards/roles.guard";
import { Role } from "src/user/enums/role";
import { WorkingHoursListDto } from "../dto/working-hours-list.dto";
import { UserWHListDto } from "../dto/user-wh-list.dto";
import { User } from "src/user/entities/user";
import { FindWorkingHoursDto } from "../dto/find-working-hours.dto";

@Controller("working-hours")
export class WorkingHoursController {
  constructor(private whService: WorkingHoursService) {}

  @Post("add")
  async add() {
    return await this.whService.addNew({ daysOff: 0, month: 5, numHours: 20, numOvertime: 0, year: 2023 });
  }

  //* GET MY CURRENT
  @Get("me/current")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard("jwt"))
  async getMyCurrent(@Request() req: { user: User }) {
    const userId = req.user.id;
    const month = new Date().getUTCMonth();

    return this.whService.findOne({ month, userId });
  }

  //* GET MY LIST
  @Get("me/list")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard("jwt"))
  async getMyList(@Query() query: UserWHListDto, @Request() req: { user: User }) {
    const queryWithUserId: WorkingHoursListDto = { ...query, userId: req.user.id };

    return await this.whService.search(queryWithUserId);
  }

  //* GET LIST
  @Get("list")
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles(Role.ADMIN, Role.OPERATOR)
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  async getList(@Query() query: WorkingHoursListDto) {
    return await this.whService.search(query);
  }

  //* GET SPECIFIC WORKING HOURS BY ID
  @Get(":workingHoursId")
  async getById(@Param() params: FindWorkingHoursDto) {
    const whId = params.workingHoursId;

    return await this.whService.findById(whId);
  }
}
