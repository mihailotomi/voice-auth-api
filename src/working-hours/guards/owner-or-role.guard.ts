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

    if (request.params?.userId && request.params.userId === user.id) {
      return true;
    }

    if (request.params?.workingHoursId) {
      const workingHours = await this.whService.findById(request.params.workingHoursId);
      if (user.id === workingHours?.user.id) return true;
    }

    return await super.canActivate(context);
  }
}
