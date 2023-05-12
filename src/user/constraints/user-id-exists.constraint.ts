import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { UserService } from "../services/user.service";

@Injectable()
@ValidatorConstraint({ name: "userIdExists", async: true })
export class UserIdExistsConstraint implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  async validate(id: number): Promise<boolean> {
    const user = await this.userService.findById(id);

    return !!user;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "User doesn't exist";
  }
}
