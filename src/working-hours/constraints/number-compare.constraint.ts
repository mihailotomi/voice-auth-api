import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { CompareOptions } from "../dto/page-options.dto";

@ValidatorConstraint()
export class NumberCompareConstraint implements ValidatorConstraintInterface {
  validate(value: CompareOptions<number>, validationArguments: ValidationArguments) {
    return typeof value?.gte === "number" && typeof value?.lte === "number" && value?.gte < value?.lte;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return `${validationArguments.targetName} must be a pair numbers (gte and lte)`;
  }
}
