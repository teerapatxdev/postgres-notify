import { config } from 'dotenv';
import { resolve } from 'path';
import { DataSource } from 'typeorm';
config();

export default new DataSource({
  type: 'postgres',
  host: process.env.PG_DB_HOST,
  port: parseInt(process.env.PG_DB_PORT),
  username: process.env.PG_DB_USERNAME,
  password: process.env.PG_DB_PASSWORD,
  database: process.env.PG_DB_NAME,
  synchronize: false,
  logging: true,
  entities: [resolve(__dirname, '../db/entities/*.entity{.ts,.js}')],
  migrations: [resolve(__dirname, '../db/migrations/*{.ts,.js}')],
  migrationsTableName: 'typeorm_migration_table',
});
