import {
  Body,
  Query,
  Controller,
  Post,
  Patch,
  UseGuards,
  UsePipes,
  Request,
  HttpCode,
  ValidationPipe,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { Get, UseInterceptors } from "@nestjs/common/decorators";
import { AuthGuard } from "@nestjs/passport";
import { MailService } from "src/mail/mail.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { LoginUserDto } from "../dto/login-user.dto";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { User } from "../entities/user";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { DemandPasswordResetDto } from "../dto/demand-password-reset.dto";
import { ChangePasswordDto } from "../dto/change-password.dto";
import { PasswordChangeGuard } from "../guards/password-change.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "../guards/roles.guard";
import { Role } from "../enums/role";

@Controller("user")
export class UserController {
  constructor(private userService: UserService, private authService: AuthService, private mailService: MailService) {}

  //* CREATE USER
  @Post("create")
  @UsePipes(ValidationPipe)
  async create(@Body() body: CreateUserDto) {
    return await this.userService.createUser(body);
  }

  //* REGISTER USER
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard("jwt"))
  async register() {}

  //* LOGIN USER
  @UseGuards(LocalAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  @Post("login")
  //// Body is injected only to be documented by Swagger, but is validated in the guard
  async login(@Body() loginUserDto: LoginUserDto, @Request() { user }: { user: User }) {
    console.log(user);

    const token = this.authService.generateUserToken(user);
    return { user, token };
  }

  //* GET USER PROFILE
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(ClassSerializerInterceptor)
  @Get("profile")
  async profile(@Request() req: { user: any }) {
    return req.user;
  }

  //* REQUEST PASSWORD RESET
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post("reset-password/request")
  async requestPasswordReset(@Body() { email }: DemandPasswordResetDto) {
    const user = (await this.userService.findOne({ email })) as User;
    const token = this.authService.generatePasswordResetToken(user);
    const { firstName, lastName } = user;

    this.mailService.sendPasswordResetEmail(user.email, { firstName, lastName }, token);

    return;
  }

  //* RESET PASSWORD
  @UseGuards(AuthGuard("password-reset"))
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post("reset-password")
  @HttpCode(200)
  async resetPassword(@Query("access_token") token: string, @Body() { password }: ResetPasswordDto) {
    const payload = (await this.authService.verifyToken(token)) as { sub: number };
    const user = await this.userService.findById(payload.sub);
    await this.userService.resetPassword(user as User, password);

    return;
  }

  //* CONFIRM EMAIL
  @UseGuards(AuthGuard("email-verify"))
  @Patch("activate")
  @HttpCode(200)
  async confirmEmail(@Query("access_token") token: string, @Body() { password }: ResetPasswordDto) {
    const payload = (await this.authService.verifyToken(token)) as { sub: number };
    const user = (await this.userService.findById(payload.sub)) as User;
    await this.userService.resetPassword(user as User, password);
    return await this.userService.activateUser(user?.id);
  }

  //* CHANGE PASSWORD
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard("jwt"), PasswordChangeGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch("change-password")
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req: { user: User }) {
    return await this.userService.changePassword(req.user, changePasswordDto.newPassword);
  }
}
