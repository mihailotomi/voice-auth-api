import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { HashingService } from "src/hashing/hashing.service";
import { TokenType } from "../enums/token-type";
import { User } from "../entities/user";
import { UserService } from "./user.service";
import { Role } from "../enums/role";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private hashingService: HashingService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordValid = await this.hashingService.compare({
      unhashed: password,
      hashed: user.password,
    });

    if (!passwordValid) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async verifyToken(token: string) {
    try {
      return await this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  generateUserOrTempToken(user: User) {
    const tokenType = user.role === Role.USER ? TokenType.REGULAR : TokenType.TEMPORARY;

    return this.jwtService.sign({
      email: user.email,
      sub: user.id,
      type: tokenType,
    });
  }

  generateNontempToken(user: User) {
    return this.jwtService.sign({
      email: user.email,
      sub: user.id,
      type: TokenType.REGULAR,
    });
  }

  async validateAdminVoice(file: Express.Multer.File) {
    return true;
  }

  generateEmailVerifyToken(payload: User) {
    return this.jwtService.sign({ sub: payload.id, type: TokenType.EMAIL_VERIFY });
  }

  generatePasswordResetToken(payload: User) {
    return this.jwtService.sign({ sub: payload.id, type: TokenType.PASSWORD_RESET });
  }
}
