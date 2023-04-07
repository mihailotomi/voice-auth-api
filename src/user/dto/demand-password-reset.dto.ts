import { Validate } from "class-validator";
import { EmailExistsConstraint } from "../constraints/email-exists.constraint";
import { EmailValidator } from "../validators/email.validator";

export class DemandPasswordResetDto {
  @EmailValidator()
  @Validate(EmailExistsConstraint)
  email: string;
}
