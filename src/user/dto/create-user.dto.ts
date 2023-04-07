import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsString, Length, Validate } from "class-validator";
import { EmailAvailableConstraint } from "../constraints/email-available.constraint";
import { Gender } from "../enums/gender";
import { Role } from "../enums/role";
import { EmailValidator } from "../validators/email.validator";
import { IdentifierValidator } from "../validators/identifier.validator";
import { PasswordValidator } from "../validators/password.validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @EmailValidator()
  @Validate(EmailAvailableConstraint)
  email: string;

  @IdentifierValidator()
  identifier: string;

  @PasswordValidator()
  password: string;

  @IsNumber()
  @IsEnum(Role)
  role: Role;

  @IsNumber()
  @IsEnum(Gender)
  gender: Gender;
}
