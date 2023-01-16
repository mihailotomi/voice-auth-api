import { applyDecorators } from "@nestjs/common";
import { IsEmail, IsNotEmpty, IsString, Validate } from "class-validator";
import { EmailAvailableConstraint } from "../constraints/email-available.constraint";

export const EmailValidator = () =>
  applyDecorators(IsString(), IsNotEmpty(), IsEmail(), Validate(EmailAvailableConstraint));
