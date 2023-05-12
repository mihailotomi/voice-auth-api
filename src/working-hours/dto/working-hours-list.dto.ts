import { IsEnum, IsIn, IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { WorkingHours } from "../entities/working-hours";
import { SortOrder } from "../enums/sort-order";
import { User } from "src/user/entities/user";
import { DateCompareConstraint } from "../constraints/date-compare.constraint";
import { NumberCompareConstraint } from "../constraints/number-compare.constraint";
import { Transform } from "class-transformer";
import { UserIdExistsConstraint } from "src/user/constraints/user-id-exists.constraint";

export type CompareOptions<T> = {
  gte: T;
  lte: T;
};

const compareOptionsToNumber = ({ gte, lte }: CompareOptions<string>) => {
  return { lte: Number.parseInt(lte), gte: Number.parseInt(gte) };
};

const compareOptionsToDate = (dateFilter: CompareOptions<string> | string) => {
  if (typeof dateFilter === "string") {
    return new Date(dateFilter);
  } else {
    return { lte: new Date(dateFilter.lte), gte: new Date(dateFilter.gte) };
  }
};

type SortByType = Omit<WorkingHours, "id" | "user" | "month" | "year"> &
  Pick<User, "username" | "role" | "gender"> & { date: any };

const sortByOptions: (keyof SortByType)[] = [
  "date",
  "daysOff",
  "gender",
  "numHours",
  "numOvertime",
  "role",
  "username",
];

export class WorkingHoursListDto {
  @IsNumber()
  @IsOptional()
  pageSize: number = 10;

  @IsNumber()
  @IsOptional()
  pageNumber: number = 1;

  @IsString()
  @IsIn(sortByOptions)
  @IsOptional()
  sort: keyof SortByType = "date";

  @IsString()
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder: SortOrder = SortOrder.ASCENDING;

  @Transform(({ value }) => compareOptionsToDate(value), { toClassOnly: true })
  @Validate(DateCompareConstraint)
  @IsOptional()
  date?: CompareOptions<Date> | Date;

  @Transform(({ value }) => parseInt(value as string), { toClassOnly: true })
  @IsNumber()
  @Validate(UserIdExistsConstraint)
  @IsOptional()
  userId?: number;

  @Transform(({ value }) => compareOptionsToNumber(value), { toClassOnly: true })
  @Validate(NumberCompareConstraint)
  @IsOptional()
  numHours?: CompareOptions<number>;

  @Transform(({ value }) => compareOptionsToNumber(value), { toClassOnly: true })
  @Validate(NumberCompareConstraint)
  @IsOptional()
  numOvertime?: CompareOptions<number>;

  @Transform(({ value }) => compareOptionsToNumber(value), { toClassOnly: true })
  @Validate(NumberCompareConstraint)
  @IsOptional()
  daysOff?: CompareOptions<number>;
}
