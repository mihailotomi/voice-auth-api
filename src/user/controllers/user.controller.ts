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
  ParseFilePipe,
  FileTypeValidator,
  UnauthorizedException,
} from "@nestjs/common";
import { Get, Param, UploadedFile, UseInterceptors } from "@nestjs/common/decorators";
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
import { Roles, RolesGuard } from "../guards/roles.guard";
import { Role } from "../enums/role";
import { RegisterUserDto } from "../dto/register-user.dto";
import { UserStatus } from "../enums/user-status";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentUserGuard } from "../guards/current-user.guard";
import { UpdateUserDto } from "../dto/update-user.dto";

@Controller("user")
export class UserController {
  constructor(private userService: UserService, private authService: AuthService, private mailService: MailService) {}

  //* CREATE USER
  @Post("create")
  @UsePipes(ValidationPipe)
  async create(@Body() body: CreateUserDto) {
    return await this.userService.createUser(body);
  }

  //* REGISTER USER BY ADMIN
  @Post("register")
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  async register(@Body() body: RegisterUserDto) {
    const user = await this.userService.createUser({ ...body, password: "@Nothing1" }, UserStatus.Inactive);
    const { firstName, lastName } = user;
    const emailVerifyToken = this.authService.generateEmailVerifyToken(user);

    await this.mailService.sendWelcomeEmail(user.email, { firstName, lastName }, emailVerifyToken);

    return user;
  }

  //* LOGIN ADMIN 2F
  @Post("2f/admin")
  @UseGuards(AuthGuard("temporary-token-admin"))
  @UseInterceptors(FileInterceptor("file"))
  async loginAdmin(
    @UploadedFile(new ParseFilePipe({ validators: [] }))
    file: Express.Multer.File,
    @Request() req: { user: User }
  ) {
    const isValid = await this.authService.validateAdminVoice(file);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return { token: this.authService.generateNontempToken(req.user) };
  }

  //* LOGIN USER
  @Post("login")
  @UseGuards(LocalAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  //// Body is injected only to be documented by Swagger
  async login(@Body() loginUserDto: LoginUserDto, @Request() { user }: { user: User }) {
    const token = this.authService.generateUserOrTempToken(user);
    return { user, token };
  }

  //* GET USER PROFILE
  @Get("profile")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard("jwt"))
  async profile(@Request() { user }: { user: User }) {
    return user;
  }

  //* UPDATE USER
  @Patch("update/:userId")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard("jwt"), CurrentUserGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param("userId") id: string, @Body() body: UpdateUserDto, @Request() req: { user: User }) {
    return await this.userService.updateUser(req.user, body);
  }

  //* REQUEST PASSWORD RESET
  @Post("reset-password/request")
  @UsePipes(new ValidationPipe({ transform: true }))
  async requestPasswordReset(@Body() { email }: DemandPasswordResetDto) {
    const user = (await this.userService.findOne({ email })) as User;
    const token = this.authService.generatePasswordResetToken(user);
    const { firstName, lastName } = user;

    await this.mailService.sendPasswordResetEmail(user.email, { firstName, lastName }, token);

    return;
  }

  //* RESET PASSWORD
  @Post("reset-password")
  @UseGuards(AuthGuard("password-reset"))
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  async resetPassword(@Query("access_token") token: string, @Body() { password }: ResetPasswordDto) {
    const payload = (await this.authService.verifyToken(token)) as { sub: number };
    const user = await this.userService.findById(payload.sub);
    await this.userService.resetPassword(user as User, password);

    return;
  }

  //* CONFIRM EMAIL
  @Patch("activate")
  @UseGuards(AuthGuard("email-verify"))
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  async confirmEmail(@Query("access_token") token: string, @Body() { password }: ResetPasswordDto) {
    const payload = (await this.authService.verifyToken(token)) as { sub: number };
    const user = (await this.userService.findById(payload.sub)) as User;
    await this.userService.resetPassword(user as User, password);

    return await this.userService.activateUser(user?.id);
  }

  //* CHANGE PASSWORD
  @Patch("change-password")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard("jwt"), PasswordChangeGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req: { user: User }) {
    return await this.userService.changePassword(req.user, changePasswordDto.newPassword);
  }
}
