import { applyDecorators } from "@nestjs/common";
import { IsString, Length, Validate } from "class-validator";
import { IdentifierAvailableConstraint } from "../constraints/identifier-available.constraint";

export const IdentifierValidator = () =>
  applyDecorators(IsString(), Length(13), Validate(IdentifierAvailableConstraint));
