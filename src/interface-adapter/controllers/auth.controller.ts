import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common'
import { GetMeUseCase, SignInUseCase, SignUpUseCase } from '@usecases/auth'
import { AccessBranchUseCase } from '@usecases/auth/access-branch.usecase'
import { SignInGuard } from '@common/guards/sign-in.guard'
import {
  AccessBranchDecodeJWT,
  RefreshTokenDecodeJWT,
  RequestAccessBranchJWT
} from '@common/interfaces'
import {
  AccessBranchRequestDto,
  AccessBranchResponseDto,
  RefreshTokenResponseDto,
  SignInRequestDto,
  SignInResponseDto,
  SignUpRequestDto,
  SignUpResponseDto
} from '@interface-adapter/dtos/auth'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RefreshTokenGuard } from '@common/guards/refresh-token.guard'
import { RefreshTokenUseCase } from '@usecases/auth/refresh-token.usecase'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _signInUseCase: SignInUseCase,
    private readonly _signUpUseCase: SignUpUseCase,
    private readonly _accessBranchUseCase: AccessBranchUseCase,
    private readonly _getMeUseCase: GetMeUseCase,
    private readonly _refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  @Post('sign-up')
  async signUp(@Body() data: SignUpRequestDto): Promise<SignUpResponseDto> {
    return this._signUpUseCase.execute(data)
  }

  @Post('sign-in')
  async signIn(@Body() data: SignInRequestDto): Promise<SignInResponseDto> {
    return this._signInUseCase.execute(data)
  }

  @Post('access-branch')
  @UseGuards(SignInGuard)
  async accessBranch(
    @Body() data: AccessBranchRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<AccessBranchResponseDto> {
    return this._accessBranchUseCase.execute(data, req.userId, req.storeCode)
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  async getMe(@Req() req: AccessBranchDecodeJWT) {
    return this._getMeUseCase.execute(req.userId, req.branchId, req.storeCode)
  }

  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@Req() req: RefreshTokenDecodeJWT): Promise<RefreshTokenResponseDto> {
    return this._refreshTokenUseCase.execute(req.userId, req.branchId, req.storeCode)
  }
}
