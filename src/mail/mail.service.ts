import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { template } from "handlebars";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private configService: ConfigService) {}

  async sendWelcomeEmail(email: string, name: { firstName: string; lastName: string }, token: string) {
    const appHost = this.configService.get<string>("APP_HOST");
    const href = `${appHost}/confirm-email/${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: "Dobrodošli",
      template: "./welcome",
      context: { name: `${name.firstName} ${name.lastName}`, href },
    });
  }

  async sendPasswordResetEmail(email: string, name: string, password: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: "Nova lozinka",
      template: "./reset-password",
      context: { password, name },
    });
  }
}
