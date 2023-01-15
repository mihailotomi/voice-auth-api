import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserService } from "../services/user/user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Post("create")
  @UsePipes(ValidationPipe)
  async create(@Body() body: CreateUserDto) {
    return await this.userService.createUser(body);
  }
}
