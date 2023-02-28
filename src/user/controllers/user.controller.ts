import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  Request,
  HttpCode,
  ValidationPipe,
} from "@nestjs/common";
import { Get } from "@nestjs/common/decorators";
import { AuthGuard } from "@nestjs/passport";
import { CreateUserDto } from "../dto/create-user.dto";
import { LoginUserDto } from "../dto/login-user.dto";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { User } from "../entities/user";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";

@Controller("user")
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

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
    const user = await this.authService.validateUser(
      loginUserDto.username,
      loginUserDto.password
    );
    const token = this.authService.generateUserToken(user);
    return { user, token };
  }

  //* GET USER PROFILE
  @UseGuards(AuthGuard("jwt"))
  @Get("profile")
  //@UseInterceptors(TemporaryPasswordInterceptor)
  //@UseFilters(new ForbiddenFilter())
  async profile(@Request() req: { user: any }) {
    return req.user;
  }

  //* RESET PASSWORD
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post("reset-password")
  @HttpCode(200)
  async resetPassword(@Body() { email }: ResetPasswordDto) {
    const user = await this.userService.findOne({ email });

    const updatedUser = await this.userService.resetPassword(user as User);

    // await this.mailService.sendPasswordResetEmail(
    //   user.email,
    //   user.firstName,
    //   updatedUser.temporaryPassword,
    // );

    return;
  }
}
