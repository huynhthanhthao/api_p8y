import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { RefreshTokenResponseDto } from '@interface-adapter/dtos/auth'
import { ACCESS_TOKEN_EXPIRY } from '@common/constants'

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly jwtService: JwtService) {}

  async execute(
    userId: string,
    branchId: string,
    storeCode: string
  ): Promise<RefreshTokenResponseDto> {
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
