import { HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { RefreshTokenResponseDto } from '@interface-adapter/dtos/auth'
import { ACCESS_TOKEN_EXPIRY } from '@common/constants'
import { PrismaService } from '@infrastructure/prisma'
import { HttpException } from '@common/exceptions'
import { REFRESH_TOKEN_ERROR } from '@common/errors'
import { UserStatusEnum } from '@common/enums'

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

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
        type: true
      }
    })

    if (!user) throw new HttpException(HttpStatus.NOT_FOUND, REFRESH_TOKEN_ERROR.USER_NOT_FOUND)

    if (user.status !== UserStatusEnum.ACTIVE)
      throw new HttpException(HttpStatus.UNAUTHORIZED, REFRESH_TOKEN_ERROR.USER_IS_INACTIVE)

    const accessToken = this.jwtService.sign(
      { userId, branchId, storeCode },
      {
        secret: process.env.JWT_SECRET_KEY_ACCESS,
        expiresIn: ACCESS_TOKEN_EXPIRY
      }
    )

    return { accessToken }
  }
}
