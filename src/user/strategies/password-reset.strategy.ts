import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/services/user.service";
import { TokenType } from "../enums/token-type";
import { UserStatus } from "../enums/user-status";
import { UserInactiveException } from "../exceptions/user-inactive.exception";

@Injectable()
export class PasswordResetStrategy extends PassportStrategy(Strategy, "password-reset") {
  constructor(private configService: ConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter("access_token"),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  async validate(payload: any) {
    const userId = payload.sub;

    if (payload.type != TokenType.PASSWORD_RESET) return false;

    const user = await this.userService.findById(userId);

    if (user && user.status !== UserStatus.Active) {
      throw new UserInactiveException();
    }

    return user;
  }
}
