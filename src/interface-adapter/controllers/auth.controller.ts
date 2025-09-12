import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common'
import { SignInUseCase, SignUpUseCase } from 'src/application/usercases/auth'
import { AccessBranchUseCase } from 'src/application/usercases/auth/access-branch.usecase'
import { SignInGuard } from 'src/common/guards/sign-in.guard'
import { RequestAccessBranchJWT } from 'src/common/interfaces'
import {
  AccessBranchRequestDto,
  AccessBranchResponseDto,
  SignInRequestDto,
  SignInResponseDto,
  SignUpRequestDto,
  SignUpResponseDto
} from 'src/interface-adapter/dtos/auth'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _signInUseCase: SignInUseCase,
    private readonly _signUpUseCase: SignUpUseCase,
    private readonly _accessBranchUseCase: AccessBranchUseCase
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
}
