"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
const path_1 = require("path");
dotenv.config({ path: (0, path_1.join)(process.cwd(), '.env') });
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Allow Vite dev server to access GraphQL playground and API
    app.enableCors({ origin: 'http://localhost:5173', methods: ['GET', 'POST', 'OPTIONS'], credentials: true });
    const port = parseInt(process.env.PORT || '4001', 10);
    await app.listen(port);
    console.log(`laRama_backend_nest listening on http://localhost:${port}`);
}
// Global handlers to surface errors that would otherwise terminate the process
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});
bootstrap().catch((err) => {
    console.error('Bootstrap error:', err && err.stack ? err.stack : err);
    // Do not call process.exit here so we can inspect logs; allow the process manager to decide
});
//# sourceMappingURL=main.js.map