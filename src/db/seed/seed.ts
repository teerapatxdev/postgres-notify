import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { seedUsers } from './data/user.seed';
import { AppModule } from 'src/app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  await seedUsers(dataSource);

  await app.close();
  console.log('Seeding completed');
}

bootstrap();
