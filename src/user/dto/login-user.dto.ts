import { IsEmail, IsNotEmpty, IsString, Validate } from "class-validator";
import { UserExistsConstraint } from "../constraints/user-exists.constraint";
import { PasswordValidator } from "../validators/password.validator";

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @Validate(UserExistsConstraint)
  username: string;

  @PasswordValidator()
  password: string;
}
