import { UnauthorizedException, HttpStatus } from "@nestjs/common";

export class UserInactiveException extends UnauthorizedException {
  constructor() {
    super("User is not active!");
  }
}
