"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeOrmConfig = getTypeOrmConfig;
const path_1 = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: (0, path_1.join)(process.cwd(), '.env') });
function getTypeOrmConfig() {
    return {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'LaRama_db_advances',
        entities: [(0, path_1.join)(__dirname, '..', '**', '*.entity.{ts,js}')],
        synchronize: true,
        logging: false,
    };
}
//# sourceMappingURL=db.utils.js.map