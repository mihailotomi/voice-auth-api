import { PasswordValidator } from "../validators/password.validator";

export class ChangePasswordDto {
  @PasswordValidator()
  oldPassword: string;

  @PasswordValidator()
  newPassword: string;
}
