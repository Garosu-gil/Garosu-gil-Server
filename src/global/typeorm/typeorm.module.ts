import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '@global/typeorm';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('typeorm.host'),
        port: configService.get('typeorm.port'),
        database: configService.get('typeorm.database'),
        username: configService.get('typeorm.username'),
        password: configService.get('typeorm.password'),
        synchronize: configService.get('typeorm.synchronize'),
        logging: configService.get('typeorm.logging'),
        entities: [...entities],
        bigNumberStrings: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class GlobalTypeOrmModule {}
