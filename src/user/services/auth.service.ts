import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { HttpService } from "@nestjs/axios/dist";
import { HashingService } from "src/hashing/hashing.service";
import { TokenType } from "../enums/token-type";
import { User } from "../entities/user";
import { UserService } from "./user.service";
import { Role } from "../enums/role";
import FormData from "form-data";
import * as fs from "fs";

import { lastValueFrom } from "rxjs";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private hashingService: HashingService,
    private jwtService: JwtService,
    private httpService: HttpService
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
    const stream = fs.createReadStream(file.path);

    const formData = new FormData();
    formData.append("audio", stream);

    const { data } = await lastValueFrom(this.httpService.post<boolean>("http://localhost:8000", formData));

    return data;
  }

  generateEmailVerifyToken(payload: User) {
    return this.jwtService.sign({ sub: payload.id, type: TokenType.EMAIL_VERIFY });
  }

  generatePasswordResetToken(payload: User) {
    return this.jwtService.sign({ sub: payload.id, type: TokenType.PASSWORD_RESET });
  }
}
