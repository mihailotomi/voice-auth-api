import { PasswordValidator } from "../validators/password.validator";

export class ResetPasswordDto {
  @PasswordValidator()
  password: string;
}
