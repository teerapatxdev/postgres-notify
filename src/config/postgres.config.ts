import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { resolve } from 'path';
import { DataSource } from 'typeorm';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (config: ConfigService<any>): TypeOrmModuleOptions => {
    return {
      type: 'postgres',
      port: parseInt(config.get('PG_DB_PORT')),
      host: String(config.get('PG_DB_HOST')),
      username: String(config.get('PG_DB_USERNAME')),
      password: String(config.get('PG_DB_PASSWORD')),
      database: String(config.get('PG_DB_NAME')),
      synchronize: false,
      entities: [resolve(__dirname, '../db/entities/*.entity{.ts,.js}')],
      migrations: [resolve(__dirname, '../db/migrations/*{.ts,.js}')],
      migrationsTableName: 'typeorm_migration_table',
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
      logging: false,
    };
  },

  dataSourceFactory: async (options) =>
    new DataSource(options)
      .initialize()
      .then((v) => {
        return v;
      })
      .catch((e) => {
        console.log('Database failed.', e);
        throw e;
      }),
};
