import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: join(process.cwd(), '.env') });

export function getTypeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'LaRama_db_advances',
    entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
    synchronize: true,
    logging: false,
  } as TypeOrmModuleOptions;
}
