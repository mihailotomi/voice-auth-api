import { Injectable } from "@nestjs/common";
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { UserService } from "../services/user.service";

@Injectable()
@ValidatorConstraint({ name: "IsEmailAvailable", async: true })
export class EmailAvailableConstraint implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  async validate(email: string): Promise<boolean> {
    const user = await this.userService.findOne({ email });

    return !user;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "Email already in use";
  }
}
