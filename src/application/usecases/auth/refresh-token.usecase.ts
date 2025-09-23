import { HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { RefreshTokenResponseDto } from '@interface-adapter/dtos/auth'
import { ACCESS_TOKEN_EXPIRY } from '@common/constants'
import { PrismaService } from '@infrastructure/prisma'
import { HttpException } from '@common/exceptions'
import { REFRESH_TOKEN_ERROR } from '@common/errors'
import { UserStatusEnum, UserTypeEnum } from '@common/enums'
import { AccessBranchDecodeJWT } from '@common/interfaces'

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  async execute(
    userId: string,
    branchId: string,
    storeCode: string
  ): Promise<RefreshTokenResponseDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        status: true,
        password: true,
        storeCode: true,
        type: true,
        roles: {
          select: {
            id: true,
            name: true,
            permissions: {
              select: {
                code: true,
                name: true
              }
            }
          }
        }
      }
    })

    if (!user) throw new HttpException(HttpStatus.NOT_FOUND, REFRESH_TOKEN_ERROR.USER_NOT_FOUND)

    if (user.status !== UserStatusEnum.ACTIVE)
      throw new HttpException(HttpStatus.UNAUTHORIZED, REFRESH_TOKEN_ERROR.USER_IS_INACTIVE)

    const permissionCodes = user.roles
      .flatMap(role => role.permissions)
      .map(permission => permission.code)

    const uniquePermissionCodes = [...new Set(permissionCodes)]

    const payload: AccessBranchDecodeJWT = {
      userId,
      storeCode,
      branchId,
      userType: user.type as UserTypeEnum,
      permissionCodes: uniquePermissionCodes
    }

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY_ACCESS,
      expiresIn: ACCESS_TOKEN_EXPIRY
    })

    return { accessToken }
  }
}
