import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkingHours } from "../entities/working-hours";
import { Repository } from "typeorm";
import { UserService } from "src/user/services/user.service";
import { User } from "src/user/entities/user";

@Injectable()
export class WorkingHoursService {
  constructor(
    @InjectRepository(WorkingHours) private readonly whRepository: Repository<WorkingHours>,
    private userService: UserService
  ) {}

  async findOne(payload: Partial<WorkingHours>) {
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
}
