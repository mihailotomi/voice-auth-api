import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingService } from "src/hashing/hashing.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { User } from "src/user/entities/user";
import { Repository } from "typeorm";
import { UserStatus } from "../enums/user-status";
import { UpdateUserDto } from "../dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private hashingService: HashingService
  ) {}

  async createUser(createUserDto: CreateUserDto, status?: UserStatus): Promise<User> {
    const hashedPassword = await this.hashingService.hash(createUserDto.password);
    const payload = {
      ...createUserDto,
      username: this.inferUsername(createUserDto),
      password: hashedPassword,
      status: status || UserStatus.Active,
    };

    const newUser = this.userRepository.create(payload);

    return await this.userRepository.save(newUser);
  }

  async findOne(payload: Partial<User>) {
    return await this.userRepository.findOneBy(payload);
  }

  async findById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  inferUsername(payload: Pick<User, "lastName" | "identifier">) {
    return payload.lastName + payload.identifier.toString();
  }

  mapToJson(user: User) {
    const { password, ...rest } = user;
    return rest;
  }

  async activateUser(id: number) {
    const updateResult = await this.userRepository
      .createQueryBuilder()
      .update(User, { status: UserStatus.Active })
      .where("id = :id", { id })
      .returning("*")
      .updateEntity(true)
      .execute();

    const user = updateResult.raw[0] as User;

    return this.mapToJson(user);
  }

  async changePassword(user: User, newPassword: string) {
    const hashedPassword = await this.hashingService.hash(newPassword);

    const updateResult = await this.userRepository
      .createQueryBuilder()
      .update(User, { password: hashedPassword })
      .where("id = :id", { id: user.id })
      .returning("*")
      .updateEntity(true)
      .execute();

    return {
      rowsAffected: updateResult.affected,
    };
  }

  async updateUser(user: User, body: UpdateUserDto) {
    let { password, ...payload } = { ...user, ...body };

    const updateResult = await this.userRepository
      .createQueryBuilder()
      .update(User, { status: UserStatus.Active })
      .where("id = :id", payload)
      .returning("*")
      .updateEntity(true)
      .execute();

    const updatedUser = updateResult.raw[0];

    return this.mapToJson(updatedUser);
  }

  async resetPassword(user: User, newPassword: string) {
    const hashedPassword = await this.hashingService.hash(newPassword);

    await this.userRepository.update(user.id, {
      password: hashedPassword,
    });
  }
}
