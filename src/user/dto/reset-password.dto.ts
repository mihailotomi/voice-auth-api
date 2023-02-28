import { Validate } from "class-validator";
import { EmailExistsConstraint } from "../constraints/email-exists.constraint";
import { EmailValidator } from "../validators/email.validator";

export class ResetPasswordDto {
  @EmailValidator()
  @Validate(EmailExistsConstraint)
  email: string;
}
