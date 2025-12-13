import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const gqlCtx = GqlExecutionContext.create(context);
    
    const req = gqlCtx.getContext().req || gqlCtx.getContext().request;
    const headers = req?.headers ?? {};
    const headerKey = (headers['x-admin-key'] || headers['X-Admin-Key']) as string | undefined;

    const expected = process.env.ADMIN_KEY || '';

    if (!headerKey || headerKey !== expected) {
      throw new UnauthorizedException('Invalid or missing admin key');
    }

    return true;
  }
}