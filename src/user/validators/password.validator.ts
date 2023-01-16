import { applyDecorators } from "@nestjs/common";
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export const PasswordValidator = () =>
  applyDecorators(
    IsString(),
    IsNotEmpty(),
    MinLength(8),
    MaxLength(20),
    Matches(/^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter and one special character",
    })
  );
