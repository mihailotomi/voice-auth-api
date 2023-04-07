import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/services/user.service";
import { TokenType } from "../enums/token-type";

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

    return await this.userService.findById(userId);
  }
}
