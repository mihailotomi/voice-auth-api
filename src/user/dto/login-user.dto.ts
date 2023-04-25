import { IsEmail, IsNotEmpty, IsString, Validate } from "class-validator";
import { UsernameExistsConstraint } from "../constraints/username-exists.constraint";
import { PasswordValidator } from "../validators/password.validator";

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @Validate(UsernameExistsConstraint)
  username: string;

  @PasswordValidator()
  password: string;
}
