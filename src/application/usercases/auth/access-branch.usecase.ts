import { HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/infrastructure/prisma'
import { HttpException } from 'src/common/exceptions'
import { ACCESS_BRANCH_ERROR } from 'src/common/errors'
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from 'src/common/contants'
import {
  AccessBranchRequestDto,
  AccessBranchResponseDto
} from 'src/interface-adapter/dtos/auth/access-branch.dto'
import { StoreWithBranches } from 'src/common/types'
import { getBranchWithUser, getStoreWithUserBranches } from 'src/common/utils'
import { Branch } from 'src/common/types/branch.type'

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
    // Kiểm tra và lấy dữ liệu
    const [branch, store] = await this.fetchUserAccessData(data.branchId, storeCode, userId)

    if (!branch || !store)
      throw new HttpException(HttpStatus.BAD_REQUEST, ACCESS_BRANCH_ERROR.BRANCH_ACCESS_DENIED)

    // Validate branch access
    this.validateBranchAccess(branch)

    // Tạo tokens
    const { accessToken, refreshToken } = this.generateTokens(userId, storeCode, branch.id)

    return {
      currentBranch: branch,
      store: store,
      accessToken,
      refreshToken
    }
  }

  private async fetchUserAccessData(
    branchId: string,
    storeCode: string,
    userId: string
  ): Promise<[Branch | null, StoreWithBranches | null]> {
    return Promise.all([
      getBranchWithUser(this.prisma, branchId, userId),
      getStoreWithUserBranches(this.prisma, storeCode, userId)
    ])
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
    const payload = { userId, storeCode, branchId }

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
}
