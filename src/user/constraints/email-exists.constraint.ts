import { Injectable } from "@nestjs/common";
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { UserService } from "../services/user.service";

@Injectable()
@ValidatorConstraint({ name: "emailExists", async: true })
export class EmailExistsConstraint implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  async validate(email: string): Promise<boolean> {
    const user = await this.userService.findOne({ email });

    return !!user;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "This email doesn't exist";
  }
}
