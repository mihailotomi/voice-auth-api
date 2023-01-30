import { CanActivate, ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../entities/role";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>("roles", context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const userRole = request.user.role;
    return roles.some((r) => r === userRole);
  }
}

////Custom decorator for passing Roles Metadata to the guard
export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);
