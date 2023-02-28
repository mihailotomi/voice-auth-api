import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingService } from "src/hashing/hashing.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { User } from "src/user/entities/user";
import { Repository } from "typeorm";
import { UserStatus } from "../entities/user-status";
import { PasswordGeneratorService } from "./password-generator.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private hashingService: HashingService,
    private passGenService: PasswordGeneratorService
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashingService.hash(
      createUserDto.password
    );
    const payload = {
      ...createUserDto,
      username: this.inferUsername(createUserDto),
      password: hashedPassword,
      status: UserStatus.Active,
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

  async resetPassword(user: User) {
    const temporaryPassword = this.passGenService.generatePassword();

    const hashedPassword = await this.hashingService.hash(temporaryPassword);

    return await this.userRepository.update(user.id, {
      password: hashedPassword,
      status: UserStatus.TemporaryPassword,
    });
  }
}
