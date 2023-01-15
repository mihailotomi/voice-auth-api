import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';
import { Gender } from '../entities/gender';
import { Role } from '../entities/role';
import { Password } from '../validators/password';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNumberString()
  @Length(13)
  identifier: string;

  @Password()
  password: string;

  @IsNumber()
  @IsEnum(Role)
  role: Role;

  @IsNumber()
  @IsEnum(Gender)
  gender: Gender;
}
