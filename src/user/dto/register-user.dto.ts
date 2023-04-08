import { OmitType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

export class RegisterUserDto extends OmitType(CreateUserDto, ["password"] as const) {}
