import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HashingModule } from "src/hashing/hashing.module";
import { MailModule } from "src/mail/mail.module";
import { EmailAvailableConstraint } from "./constraints/email-available.constraint";
import { EmailExistsConstraint } from "./constraints/email-exists.constraint";
import { IdentifierAvailableConstraint } from "./constraints/identifier-available.constraint";
import { UserExistsConstraint } from "./constraints/user-exists.constraint";
import { UserController } from "./controllers/user.controller";
import { User } from "./entities/user";
import { AuthService } from "./services/auth.service";
import { PasswordGeneratorService } from "./services/password-generator.service";
import { UserService } from "./services/user.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HashingModule,
    PassportModule,
    MailModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>("JWT_SECRET"),
          signOptions: {
            expiresIn: configService.get<string>("JWT_EXPIRATION_TIME"),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [
    //// service
    UserService,
    AuthService,
    PasswordGeneratorService,

    //// constraints
    EmailAvailableConstraint,
    IdentifierAvailableConstraint,
    UserExistsConstraint,
    EmailExistsConstraint,

    //// strategies
    LocalStrategy,
    JwtStrategy,
  ],
})
export class UserModule {}
