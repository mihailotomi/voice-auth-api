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
import { UsernameExistsConstraint } from "./constraints/username-exists.constraint";
import { UserController } from "./controllers/user.controller";
import { User } from "./entities/user";
import { AuthService } from "./services/auth.service";
import { UserService } from "./services/user.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { PasswordResetStrategy } from "./strategies/password-reset.strategy";
import { EmailVerifyStrategy } from "./strategies/email-verify.strategy";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { MulterModule } from "@nestjs/platform-express/multer";
import { TemporaryTokenStrategy } from "./strategies/temporary-token.strategy";
import { CurrentUserGuard } from "./guards/current-user.guard";
import { RolesGuard } from "./guards/roles.guard";
import { PasswordChangeGuard } from "./guards/password-change.guard";
import { UserIdExistsConstraint } from "./constraints/user-id-exists.constraint";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HashingModule,
    PassportModule,
    MailModule,
    MulterModule.register({
      dest: "./files",
    }),
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

    //// constraints
    EmailAvailableConstraint,
    IdentifierAvailableConstraint,
    UsernameExistsConstraint,
    EmailExistsConstraint,
    UserIdExistsConstraint,

    //// strategies
    JwtStrategy,
    PasswordResetStrategy,
    EmailVerifyStrategy,
    TemporaryTokenStrategy,

    //// guards
    LocalAuthGuard,
    CurrentUserGuard,
    RolesGuard,
    PasswordChangeGuard,
  ],
  exports: [UserService, AuthService],
})
export class UserModule {}
