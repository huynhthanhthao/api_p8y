import { UserTypeEnum } from '@common/enums'
import { AccessBranchDecodeJWT } from '@common/interfaces'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler())
    const request = context.switchToHttp().getRequest() as AccessBranchDecodeJWT
    console.log(requiredRoles, request.userType)

    if (
      !requiredRoles ||
      requiredRoles.length === 0 ||
      request.userType === UserTypeEnum.SUPER_ADMIN
    ) {
      return true
    }

    const permissionsInRole = request.permissionCodes?.filter(code => requiredRoles.includes(code))

    return permissionsInRole?.length > 0
  }
}
