import { Transform } from "class-transformer";
import { Validate } from "class-validator";
import { WhIdExistsConstraint } from "../constraints/wh-id-exists.constraint";

export class FindWorkingHoursDto {
  @Transform(({ value }) => parseInt(value))
  @Validate(WhIdExistsConstraint)
  workingHoursId: number;
}
