import * as bcrypt from 'bcrypt'
import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { SignInRequestDto, SignInResponseDto } from '@interface-adapter/dtos/auth/sign-in.dto'
import { JwtService } from '@nestjs/jwt'
import { UserStatusEnum, UserTypeEnum } from '@common/enums'
import { HttpException } from '@common/exceptions'
import { SIGNIN_ERROR } from '@common/errors'
import { SIGNIN_TOKEN_EXPIRY } from '@common/constants'
import { getStoreWithAccessibleBranches } from '@common/utils/auth/get-store-with-access-branches.util'
import { SignInDecodeJWT } from '@common/interfaces'

@Injectable()
export class SignInUseCase {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(data: SignInRequestDto): Promise<SignInResponseDto> {
    const user = await this.prismaClient.user.findUnique({
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
        storeCode: true,
        type: true
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
    const accessUserId = user.type === UserTypeEnum.SUPER_ADMIN ? undefined : user.id

    const store = await getStoreWithAccessibleBranches(
      this.prismaClient,
      user.storeCode,
      accessUserId
    )

    if (!store) throw new HttpException(HttpStatus.BAD_REQUEST, SIGNIN_ERROR.SHOP_ACCESS_DENIED)

    // Tạo signInToken
    const signInToken = this.jwtService.sign(
      {
        userId: user.id,
        storeCode: store.code
      } as SignInDecodeJWT,
      { expiresIn: SIGNIN_TOKEN_EXPIRY, secret: process.env.JWT_SECRET_KEY_SIGNUP }
    )

    const userUpdated = await this.prismaClient.user.update({
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
            permissions: {
              select: {
                code: true,
                groupCode: true,
                name: true
              }
            }
          }
        }
      }
    })

    return {
      signInToken: signInToken,
      store: store,
      user: userUpdated
    }
  }
}
