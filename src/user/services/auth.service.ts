import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { HashingService } from "src/hashing/hashing.service";
import { User } from "../entities/user";
import { UserService } from "./user.service";

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

  generateUserToken(payload: User) {
    return this.jwtService.sign({
      email: payload.email,
      sub: payload.id,
    });
  }

  // generateEmailVerifyToken(payload: User) {
  //   return this.jwtService.sign({ id: payload.id });
  // }

  // async verifyEmailToken(token: string) {
  //   try {
  //     const { id } = this.jwtService.verify<{ id: string }>(token);
  //     await this.userService.findByIdAndUpdate(id, { active: true });
  //   } catch (error) {
  //     throw new BadRequestException('Unable to verify email');
  //   }
  // }
}
