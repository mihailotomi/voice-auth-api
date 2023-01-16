import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { UserService } from "../services/user.service";

@Injectable()
@ValidatorConstraint({ name: "isIdentifierAvailable", async: true })
export class IdentifierAvailableConstraint implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  async validate(identifier: string): Promise<boolean> {
    const user = await this.userService.findOne({ identifier });

    return !user;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "Identifier already in use";
  }
}
