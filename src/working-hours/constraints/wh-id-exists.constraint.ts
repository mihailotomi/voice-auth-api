import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { WorkingHoursService } from "../services/working-hours.service";

@Injectable()
@ValidatorConstraint({ name: "whIdExists", async: true })
export class WhIdExistsConstraint implements ValidatorConstraintInterface {
  constructor(private whService: WorkingHoursService) {}

  async validate(id: number): Promise<boolean> {
    const workingHours = await this.whService.findById(id);

    return !!workingHours;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "Working hours with this id don't exist";
  }
}
