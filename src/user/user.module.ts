import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HashingModule } from "src/hashing/hashing.module";
import { EmailAvailableConstraint } from "./constraints/email-available.constraint";
import { IdentifierAvailableConstraint } from "./constraints/identifier-available.constraint";
import { UserController } from "./controllers/user.controller";
import { User } from "./entities/user";
import { AuthService } from "./services/auth.service";
import { UserService } from "./services/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([User]), HashingModule],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule {}
