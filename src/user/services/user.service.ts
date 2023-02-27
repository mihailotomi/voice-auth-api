import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingService } from "src/hashing/hashing.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { User } from "src/user/entities/user";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private hashingService: HashingService
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashingService.hash(
      createUserDto.password
    );
    const payload = {
      ...createUserDto,
      username: this.inferUsername(createUserDto),
      password: hashedPassword,
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
}
