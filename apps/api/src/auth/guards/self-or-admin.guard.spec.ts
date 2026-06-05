import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { SelfOrAdminGuard } from './self-or-admin.guard';

describe('SelfOrAdminGuard', () => {
  let guard: SelfOrAdminGuard;

  beforeEach(() => {
    guard = new SelfOrAdminGuard();
  });

  const createContext = (
    user: { id: string; role: UserRole },
    params: { id: string },
  ): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          user,
          params,
        }),
      }),
    }) as ExecutionContext;

  it('should allow access when user is the owner', () => {
    const context = createContext(
      {
        id: 'user-1',
        role: UserRole.WAREHOUSE_STAFF,
      },
      {
        id: 'user-1',
      },
    );

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access when user is admin', () => {
    const context = createContext(
      {
        id: 'admin-1',
        role: UserRole.ADMIN,
      },
      {
        id: 'user-1',
      },
    );

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException when user is not owner and not admin', () => {
    const context = createContext(
      {
        id: 'user-2',
        role: UserRole.WAREHOUSE_STAFF,
      },
      {
        id: 'user-1',
      },
    );

    expect(() => guard.canActivate(context)).toThrow(
      ForbiddenException,
    );
  });

  it('should throw correct error message', () => {
    const context = createContext(
      {
        id: 'user-2',
        role: UserRole.WAREHOUSE_STAFF,
      },
      {
        id: 'user-1',
      },
    );

    expect(() => guard.canActivate(context)).toThrow(
      'You do not have permission to perform this action',
    );
  });
});