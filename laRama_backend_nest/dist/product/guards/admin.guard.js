"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminGuard = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
let AdminGuard = class AdminGuard {
    canActivate(context) {
        const gqlCtx = graphql_1.GqlExecutionContext.create(context);
        const ctx = gqlCtx.getContext();
        const req = ctx.req || ctx?.request;
        const headers = (req && (req.headers || req.raw && req.raw.headers)) || {};
        const headerKey = headers['x-admin-key'] || headers['X-Admin-Key'] || headers['x-admin-key'];
        const expected = process.env.ADMIN_KEY || '';
        if (!headerKey || headerKey !== expected) {
            throw new common_1.UnauthorizedException('Invalid or missing admin key');
        }
        return true;
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = __decorate([
    (0, common_1.Injectable)()
], AdminGuard);
//# sourceMappingURL=admin.guard.js.map