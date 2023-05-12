import { OmitType } from "@nestjs/swagger";
import { WorkingHoursListDto } from "./working-hours-list.dto";

export class UserWHListDto extends OmitType(WorkingHoursListDto, ["userId"] as const) {}
