import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { User } from "src/user/entities/user";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  createUser(createUserDto: CreateUserDto): Promise<User> {
    const payload = { ...createUserDto, username: this.inferUsername(createUserDto) };

    const newUser = this.userRepository.create(payload);

    return this.userRepository.save(newUser);
  }

  inferUsername(payload: Pick<User, "lastName" | "identifier">) {
    return payload.lastName + payload.identifier.toString();
  }
}
