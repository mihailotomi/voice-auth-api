import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user/entities/user';
import { UserModule } from './user/user.module';
import { HashingModule } from './hashing/hashing.module';
import { MailModule } from './mail/mail.module';
import { WorkingHoursModule } from './working-hours/working-hours.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ envFilePath: 'develop.env', isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +(configService.get<number>('DB_PORT') as number),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    HashingModule,
    MailModule,
    WorkingHoursModule,
  ],
})
export class AppModule {}
