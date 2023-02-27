import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HashingModule } from "src/hashing/hashing.module";
import { EmailAvailableConstraint } from "./constraints/email-available.constraint";
import { IdentifierAvailableConstraint } from "./constraints/identifier-available.constraint";
import { UserExistsConstraint } from "./constraints/user-exists.constraint";
import { UserController } from "./controllers/user.controller";
import { User } from "./entities/user";
import { AuthService } from "./services/auth.service";
import { UserService } from "./services/user.service";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [TypeOrmModule.forFeature([User]), HashingModule, PassportModule],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    EmailAvailableConstraint,
    IdentifierAvailableConstraint,
    UserExistsConstraint,
    LocalStrategy,
  ],
})
export class UserModule {}
