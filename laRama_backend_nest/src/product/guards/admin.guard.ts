import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    const req = ctx?.req || ctx?.request;
    const headers = req?.headers ?? {};
    const headerKey = headers['x-admin-key'] as string | undefined;

    const expected = process.env.ADMIN_KEY || '';

    if (!headerKey || headerKey !== expected) {
      throw new UnauthorizedException('Invalid or missing admin key');
    }

    return true;
  }
}