import { PartialType } from "@nestjs/swagger";
import { RegisterUserDto } from "./register-user.dto";
import { IsOptional, Validate } from "class-validator";
import { UsernameExistsConstraint } from "../constraints/username-exists.constraint";

export class UpdateUserDto extends PartialType(RegisterUserDto) {
  @IsOptional()
  @Validate(UsernameExistsConstraint)
  username?: string;
}
