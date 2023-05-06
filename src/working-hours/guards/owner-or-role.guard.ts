import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User } from "src/user/entities/user";
import { RolesGuard } from "src/user/guards/roles.guard";
import { WorkingHoursService } from "../services/working-hours.service";

export class OwnerOrRoleGuard extends RolesGuard implements CanActivate {
  constructor(protected reflector: Reflector, private whService: WorkingHoursService) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    if (request.params?.userId) {
      return request.params.userId === user.id;
    }
    if (request.params?.workingHoursId) {
      const workingHours = await this.whService.findById(request.params.workingHoursId);
      return true;
    }
    return true;
  }
}
