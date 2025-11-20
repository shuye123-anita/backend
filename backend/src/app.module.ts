import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { AvailabilityModule } from './availability/availability.module';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('DB_HOST');
        const port = config.get<string>('DB_PORT');
        const username = config.get<string>('DB_USER');
        const password = config.get<string>('DB_PASSWORD');
        const database = config.get<string>('DB_NAME');

        if (!host || !username || !database) {
          return {
            type: 'sqlite' as const,
            database: ':memory:',
            autoLoadEntities: true,
            synchronize: true,
          };
        }

        return {
          type: 'postgres' as const,
          host,
          port: port ? parseInt(port, 10) : 5432,
          username,
          password,
          database,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    UsersModule,
    VehiclesModule,
    AvailabilityModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
