import { Controller, Post, Body } from '@nestjs/common'
import { SignInUseCase, SignUpUseCase } from 'src/application/usercases/auth'
import {
  SignInRequestDto,
  SignInResponseDto,
  SignUpRequestDto,
  SignUpResponseDto
} from 'src/interface-adapter/dtos/auth'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _signInUseCase: SignInUseCase,
    private readonly _signUpUseCase: SignUpUseCase
  ) {}

  @Post('sign-up')
  async signUp(@Body() data: SignUpRequestDto): Promise<SignUpResponseDto> {
    return this._signUpUseCase.execute(data)
  }

  @Post('sign-in')
  async signIn(@Body() data: SignInRequestDto): Promise<SignInResponseDto> {
    return this._signInUseCase.execute(data)
  }
}
