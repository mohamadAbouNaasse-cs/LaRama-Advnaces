import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:5173', credentials: true });

  const port = parseInt(process.env.PORT || '4001', 10);
  await app.listen(port, '127.0.0.1');
  console.log(`laRama_backend_nest listening on http://127.0.0.1:${port}`);
}

bootstrap();