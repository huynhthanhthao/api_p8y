import { HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@infrastructure/prisma'
import { HttpException } from '@common/exceptions'
import { ACCESS_BRANCH_ERROR } from '@common/errors'
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '@common/constants'
import {
  AccessBranchRequestDto,
  AccessBranchResponseDto
} from '@interface-adapter/dtos/auth/access-branch.dto'
import { UserBasicInfo } from '@common/types'
import { getBranchWithUserAccess, getStoreWithAccessibleBranches } from '@common/utils'
import { UserTypeEnum } from '@common/enums'
import { AccessBranchDecodeJWT, RefreshTokenDecodeJWT } from '@common/interfaces'

@Injectable()
export class AccessBranchUseCase {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: AccessBranchRequestDto,
    userId: string,
    storeCode: string
  ): Promise<AccessBranchResponseDto> {
    const user = await this.getUserByIdAndStoreCode(userId, storeCode)

    const accessUserId = user.type === UserTypeEnum.SUPER_ADMIN ? undefined : userId

    const [branch, store] = await Promise.all([
      getBranchWithUserAccess(this.prismaClient, data.branchId, accessUserId),
      getStoreWithAccessibleBranches(this.prismaClient, storeCode, accessUserId)
    ])

    if (!branch || !store)
      throw new HttpException(HttpStatus.BAD_REQUEST, ACCESS_BRANCH_ERROR.BRANCH_ACCESS_DENIED)

    this.validateBranchAccess(branch)

    const permissionCodes = user.roles
      .flatMap(role => role.permissions)
      .map(permission => permission.code)

    const { accessToken, refreshToken } = this.generateTokens(
      userId,
      storeCode,
      branch.id,
      user.type as UserTypeEnum,
      permissionCodes
    )

    return {
      currentBranch: branch,
      store: store,
      user,
      accessToken,
      refreshToken
    }
  }

  private validateBranchAccess(branch: any): void {
    if (!branch) {
      throw new HttpException(HttpStatus.FORBIDDEN, ACCESS_BRANCH_ERROR.BRANCH_ACCESS_DENIED)
    }

    if (branch.expiryAt && branch.expiryAt < new Date()) {
      throw new HttpException(HttpStatus.FORBIDDEN, ACCESS_BRANCH_ERROR.BRANCH_EXPIRED)
    }
  }

  private generateTokens(
    userId: string,
    storeCode: string,
    branchId: string,
    userType: UserTypeEnum,
    permissionCodes: string[]
  ) {
    const uniquePermissionCodes = [...new Set(permissionCodes)]

    const payloadAccessToken: AccessBranchDecodeJWT = {
      userId,
      storeCode,
      branchId,
      userType: userType,
      permissionCodes: uniquePermissionCodes
    }

    const accessToken = this.jwtService.sign(payloadAccessToken, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
      secret: process.env.JWT_SECRET_KEY_ACCESS
    })

    const payloadRefreshToken: RefreshTokenDecodeJWT = {
      userId,
      storeCode,
      branchId
    }

    const refreshToken = this.jwtService.sign(payloadRefreshToken, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
      secret: process.env.JWT_SECRET_KEY_REFRESH
    })

    return { accessToken, refreshToken }
  }

  private async getUserByIdAndStoreCode(userId: string, storeCode: string): Promise<UserBasicInfo> {
    return this.prismaClient.user.findUniqueOrThrow({
      where: { id: userId, storeCode },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        type: true,
        status: true,
        address: true,
        lastLogin: true,
        avatarId: true,
        avatar: {
          omit: {
            deletedAt: true,
            deletedBy: true,
            createdBy: true,
            updatedBy: true
          }
        },
        roles: {
          select: {
            id: true,
            name: true,
            permissions: {
              select: {
                code: true,
                name: true,
                groupCode: true
              }
            }
          }
        }
      }
    })
  }
}
