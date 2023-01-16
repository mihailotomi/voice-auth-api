import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";

@Injectable()
export class HashingService {
  saltRounds!: number;

  constructor(private configService: ConfigService) {
    this.saltRounds = parseInt(configService.get<string>("SALT_ROUNDS") as string);
  }

  async hash(text: string) {
    return await bcrypt.hash(text, this.saltRounds);
  }

  async compare({ hashed, unhashed }: { hashed: string; unhashed: string }) {
    return await bcrypt.compare(unhashed, hashed);
  }
}
