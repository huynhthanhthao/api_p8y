import * as bcrypt from 'bcrypt'
import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/infrastructure/prisma'
import { SignInRequestDto, SignInResponseDto } from 'src/interface-adapter/dtos/auth/sign-in.dto'
import { JwtService } from '@nestjs/jwt'
import { UserStatusEnum } from 'src/common/enums'
import { HttpException } from 'src/common/exceptions'
import { SIGNIN_ERROR } from 'src/common/errors'
import { SIGNIN_EXPIRY } from 'src/common/contants'
import { getStoreWithUserBranches } from 'src/common/utils/get-store-with-user.util'
import { LoginDecodeJWT } from 'src/common/interfaces'

@Injectable()
export class SignInUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async execute(data: SignInRequestDto): Promise<SignInResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        idx_store_phone: {
          storeCode: data.storeCode,
          phone: data.phone
        }
      },
      select: {
        id: true,
        status: true,
        password: true,
        storeCode: true
      }
    })

    if (!user) {
      throw new HttpException(HttpStatus.NOT_FOUND, SIGNIN_ERROR.INVALID_CREDENTIALS)
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password)

    if (!isPasswordValid) {
      throw new HttpException(HttpStatus.NOT_FOUND, SIGNIN_ERROR.INVALID_CREDENTIALS)
    }

    if (user.status !== UserStatusEnum.ACTIVE) {
      throw new HttpException(HttpStatus.UNAUTHORIZED, SIGNIN_ERROR.ACCOUNT_LOCKED)
    }

    // Lấy danh sách branch mà user có quyền truy cập
    const store = await getStoreWithUserBranches(this.prisma, user.storeCode, user.id)

    if (!store) throw new HttpException(HttpStatus.BAD_REQUEST, SIGNIN_ERROR.SHOP_ACCESS_DENIED)

    // Tạo signInToken
    const signInToken = this.jwtService.sign(
      {
        userId: user.id,
        storeCode: store.code
      } as LoginDecodeJWT,
      { expiresIn: SIGNIN_EXPIRY, secret: process.env.JWT_SECRET_KEY_SIGNUP }
    )

    const userUpdated = await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
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

    return {
      signInToken: signInToken,
      store: store,
      user: userUpdated
    }
  }
}
