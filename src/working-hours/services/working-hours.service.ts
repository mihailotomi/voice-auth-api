import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkingHours } from "../entities/working-hours";
import { Brackets, Repository } from "typeorm";
import { UserService } from "src/user/services/user.service";
import { User } from "src/user/entities/user";
import { CompareOptions, WorkingHoursListDto } from "../dto/working-hours-list.dto";

@Injectable()
export class WorkingHoursService {
  constructor(
    @InjectRepository(WorkingHours) private readonly whRepository: Repository<WorkingHours>,
    private userService: UserService
  ) {}

  async findOne(payload: Partial<Omit<WorkingHours, "user"> & { userId: number }>) {
    if (payload?.userId) {
      const { userId, ...restPayload } = payload;
      return await this.whRepository.findOne({ where: { user: { id: userId }, ...restPayload } });
    }
    return await this.whRepository.findOneBy(payload);
  }

  async findById(id: number) {
    return await this.whRepository.findOneBy({ id });
  }

  async addNew(payload: Omit<WorkingHours, "id" | "user">) {
    const user = (await this.userService.findById(8)) as User;
    const workingHours = this.whRepository.create({ ...payload, user });

    return await this.whRepository.save(workingHours);
  }

  async search(payload: WorkingHoursListDto) {
    const query = this.whRepository.createQueryBuilder("working_hours");

    //// FILTERING
    //! Note that all parameters must be uniquely named in when clauses
    if (payload.numOvertime) {
      query
        .andWhere("num_overtime >= :overtimeGte", { overtimeGte: payload.numOvertime.gte })
        .andWhere("num_overtime <= :overtimeLte", { overtimeLte: payload.numOvertime.lte });
    }
    if (payload.numHours) {
      query
        .andWhere("num_hours >= :hoursGte", { hoursGte: payload.numHours.gte })
        .andWhere("num_hours <= :HoursLte", { HoursLte: payload.numHours.lte });
    }
    if (payload.daysOff) {
      query
        .andWhere("days_off >= :daysGte", { daysGte: payload.daysOff.gte })
        .andWhere("days_off <= :daysLte", { daysLte: payload.daysOff.lte });
    }
    if (payload.date) {
      if (payload.date instanceof Date) {
        query
          .andWhere("year = :year", { year: payload.date.getUTCFullYear() })
          .andWhere("month <= :month", { month: payload.date.getUTCMonth() });
      } else {
        const lte = { month: payload.date.lte.getUTCMonth(), year: payload.date.lte.getUTCFullYear() };
        const gte = { month: payload.date.gte.getUTCMonth(), year: payload.date.gte.getUTCFullYear() };

        query
          .andWhere(
            new Brackets((qb) => {
              qb.where("year > :gteYear", { gteYear: gte.year }).orWhere(
                new Brackets((qb) => {
                  qb.where("year = :gteYear", { gteYear: gte.year }).andWhere("month >= :gteMonth", {
                    gteMonth: gte.month,
                  });
                })
              );
            })
          )
          .andWhere(
            new Brackets((qb) => {
              qb.where("year < :lteYear", { lteYear: lte.year }).orWhere(
                new Brackets((qb) => {
                  qb.where("year = :lteYear", { lteYear: lte.year }).andWhere("month <= :lteMonth", {
                    lteMonth: lte.month,
                  });
                })
              );
            })
          );
      }
    }
    if (payload.userId) {
      query.andWhere("user_id = :userId", { userId: payload.userId });
    }

    //// SORTING
    if (payload.sort === "date") {
      query.orderBy("year", payload.sortOrder).addOrderBy("month", payload.sortOrder);
    } else {
      query.orderBy(payload.sort, payload.sortOrder);
    }

    //// RETURNING
    return await query
      .skip(payload.pageSize * (payload.pageNumber - 1))
      .take(payload.pageSize)
      .getMany();
  }
}
