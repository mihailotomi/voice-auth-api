import { applyDecorators } from "@nestjs/common";
import { IsEmail, IsNotEmpty, IsString, Validate } from "class-validator";

export const EmailValidator = () => applyDecorators(IsString(), IsNotEmpty(), IsEmail());
