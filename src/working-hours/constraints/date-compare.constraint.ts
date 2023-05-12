import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { CompareOptions } from "../dto/working-hours-list.dto";

@ValidatorConstraint()
export class DateCompareConstraint implements ValidatorConstraintInterface {
  validate(value: CompareOptions<Date> | Date, validationArguments: ValidationArguments) {
    return value instanceof Date || (value?.gte instanceof Date && value?.lte instanceof Date && value.gte < value.lte);
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return `${validationArguments.targetName} mmust be a date or a pair of dates (gte and lte)`;
  }
}
