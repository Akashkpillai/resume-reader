import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLE_KEYS } from 'src/decorators/role.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // ✅ Get required roles from metadata
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLE_KEYS,
      [context.getHandler(), context.getClass()],
    );

    // ✅ If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const userRoles = Array.isArray(request.role)
      ? request.role
      : [request.role]; // supports single or multiple roles

    const hasPermission = requiredRoles.some((role) =>
      userRoles.includes(role),
    );

    if (!hasPermission) {
      throw new UnauthorizedException('No permission/sensitive data');
    }

    return true;
  }
}
