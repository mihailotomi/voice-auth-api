import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { UserService } from "../services/user.service";

@Injectable()
@ValidatorConstraint({ name: "userExists", async: true })
export class UsernameExistsConstraint implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  async validate(username: string): Promise<boolean> {
    const user = await this.userService.findOne({ username });

    return !!user;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "User doesn't exist";
  }
}
