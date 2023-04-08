import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { LoginUserDto } from "../dto/login-user.dto";
import { validate } from "class-validator";
import { AuthService } from "../services/auth.service";
import { UserStatus } from "../enums/user-status";
import { UserInactiveException } from "../exceptions/user-inactive.exception";

//// No passport strategies are used for local guard, because they don't allow validating the body with class-validator
@Injectable()
export class LocalAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = plainToInstance(LoginUserDto, request.body);

    const errors = await validate(body);
    if (errors.length) {
      console.log(errors[0]);

      const message = errors[0].constraints ? Object.values(errors[0].constraints) : null;

      throw new BadRequestException(message);
    }

    const user = await this.authService.validateUser(body.username, body.password);

    if (user.status !== UserStatus.Active) {
      throw new UserInactiveException();
    }

    request.user = user;

    return !!user;
  }
}
