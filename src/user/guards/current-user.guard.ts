import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { User } from "../entities/user";
import { UserService } from "../services/user.service";

// Maybe the name is not very intuitive, user can update only his entity with jwt
@Injectable()
export class CurrentUserGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    const targetUserId = request.params.id;

    if (!(await this.userService.findById(targetUserId))) {
      throw new BadRequestException("User doesn't exist");
    }

    return user.id === targetUserId;
  }
}
