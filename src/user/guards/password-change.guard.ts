import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Observable } from "rxjs";
import { HashingService } from "src/hashing/hashing.service";
import { ChangePasswordDto } from "../dto/change-password.dto";
import { UserService } from "../services/user.service";

@Injectable()
export class PasswordChangeGuard implements CanActivate {
  constructor(private readonly userService: UserService, private readonly hashingService: HashingService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    ////validating request body because guards run before pipes
    const body = plainToInstance(ChangePasswordDto, request.body);
    await validate(body);

    return await this.hashingService.compare({
      hashed: user.password,
      unhashed: request.body.oldPassword,
    });
  }
}
