import { ExecutionContext, HttpException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { LoginUserDto } from "../dto/login-user.dto";

export class LocalAuthGuard extends AuthGuard("local") {
  handleRequest<TUser = any>(err: any, user: TUser, info: any, context: ExecutionContext, status?: any): TUser | void {
    const request = context.switchToHttp().getRequest();
    const body = plainToInstance(LoginUserDto, request.body);

    ////guards demand manual validation
    validate(body).then(() => user);
  }
}
