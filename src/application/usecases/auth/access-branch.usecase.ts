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
import { AccessBranchDecodeJWT } from '@common/interfaces'

@Injectable()
export class AccessBranchUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async execute(
    data: AccessBranchRequestDto,
    userId: string,
    storeCode: string
  ): Promise<AccessBranchResponseDto> {
    const user = await this.getUserByIdAndStoreCode(userId, storeCode)

    const accessUserId = user.type === UserTypeEnum.SUPER_ADMIN ? undefined : userId

    const [branch, store] = await Promise.all([
      getBranchWithUserAccess(this.prisma, data.branchId, accessUserId),
      getStoreWithAccessibleBranches(this.prisma, storeCode, accessUserId)
    ])

    if (!branch || !store)
      throw new HttpException(HttpStatus.BAD_REQUEST, ACCESS_BRANCH_ERROR.BRANCH_ACCESS_DENIED)

    this.validateBranchAccess(branch)

    const { accessToken, refreshToken } = this.generateTokens(userId, storeCode, branch.id)

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

  private generateTokens(userId: string, storeCode: string, branchId: string) {
    const payload: AccessBranchDecodeJWT = { userId, storeCode, branchId }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
      secret: process.env.JWT_SECRET_KEY_ACCESS
    })

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
      secret: process.env.JWT_SECRET_KEY_REFRESH
    })

    return { accessToken, refreshToken }
  }

  private async getUserByIdAndStoreCode(userId: string, storeCode: string): Promise<UserBasicInfo> {
    return this.prisma.user.findUniqueOrThrow({
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
        avatarUrl: true
      }
    })
  }
}
