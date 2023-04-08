import { Body, Query, Controller, Post, Patch, UseGuards, UsePipes, Request, HttpCode, ValidationPipe, ClassSerializerInterceptor } from "@nestjs/common";
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

@Controller("user")
export class UserController {
  constructor(private userService: UserService, private authService: AuthService, private mailService: MailService) {}

  //* CREATE USER
  @Post("create")
  @UsePipes(ValidationPipe)
  async create(@Body() body: CreateUserDto) {
    return await this.userService.createUser(body);
  }

  //* LOGIN USER
  @UseGuards(LocalAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post("login")
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(loginUserDto.username, loginUserDto.password);
    const token = this.authService.generateUserToken(user);
    return { user, token };
  }

  //* GET USER PROFILE
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(ClassSerializerInterceptor)
  @Get("profile")
  //@UseInterceptors(TemporaryPasswordInterceptor)
  //@UseFilters(new ForbiddenFilter())
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
  async resetPassword(@Query("access_token") token: string, @Body() { newPassword }: ResetPasswordDto) {
    const payload = (await this.authService.verifyToken(token)) as { sub: number };
    const user = await this.userService.findById(payload.sub);
    await this.userService.resetPassword(user as User, newPassword);

    return;
  }

  //* CONFIRM EMAIL
  @UseGuards(AuthGuard("email-verify"))
  @Post("verify-email")
  @HttpCode(200)
  async confirmEmail(@Query("access_token") token: string) {
    const payload = (await this.authService.verifyToken(token)) as { sub: number };
    return await this.userService.activateUser(payload.sub);
  }

  //* CHANGE PASSWORD
  @UseGuards(AuthGuard("jwt"), PasswordChangeGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch("change-password")
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req: { user: User }) {
    return await this.userService.changePassword(req.user, changePasswordDto.newPassword);
  }
}
