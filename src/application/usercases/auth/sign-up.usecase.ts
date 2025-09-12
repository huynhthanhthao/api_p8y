import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/infrastructure/prisma'
import { SignUpRequestDto, SignUpResponseDto } from 'src/interface-adapter/dtos/auth'
import { UserTypeEnum, UserStatusEnum } from 'src/common/enums'
import { generateStoreCode } from 'src/common/helpers'
import { HttpException } from 'src/common/exceptions'
import { HttpStatus, Injectable } from '@nestjs/common'
import { STORE_EXPIRY_DAYS } from 'src/common/contants/time.constant'
import { SIGNUP_ERROR } from 'src/common/errors'

@Injectable()
export class SignUpUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: SignUpRequestDto): Promise<SignUpResponseDto> {
    const storeCode = generateStoreCode(data.storeName)

    await this.validateStoreExists(storeCode)

    await this.validateUserExists(data.phone)

    await this.createStoreAndUserSuperAdmin(data, storeCode)

    return { storeCode }
  }

  private async validateStoreExists(storeCode: string): Promise<void> {
    const store = await this.prisma.store.findUnique({ where: { code: storeCode } })

    if (store) {
      throw new HttpException(HttpStatus.CONFLICT, SIGNUP_ERROR.STORE_ALREADY_EXISTS)
    }
  }

  private async validateUserExists(phone: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { phone, type: UserTypeEnum.SUPER_ADMIN }
    })
    if (user) {
      throw new HttpException(HttpStatus.CONFLICT, SIGNUP_ERROR.PHONE_ALREADY_EXISTS)
    }
  }

  private async createStoreAndUserSuperAdmin(
    data: SignUpRequestDto,
    storeCode: string
  ): Promise<void> {
    await this.prisma.$transaction(async tx => {
      const store = await tx.store.create({
        data: {
          name: data.storeName,
          code: storeCode,
          expiryAt: new Date(Date.now() + STORE_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
          branches: {
            create: {
              name: 'Chi nhánh trung tâm',
              phone: data.phone,
              provinceCode: data.provinceCode
            }
          }
        },
        select: {
          code: true,
          branches: { select: { id: true } }
        }
      })

      await tx.user.create({
        data: {
          firstName: 'Chủ cửa hàng',
          phone: data.phone,
          storeCode: store.code,
          status: UserStatusEnum.ACTIVE,
          type: UserTypeEnum.SUPER_ADMIN,
          password: await bcrypt.hash(data.password, 10),
          branches: { connect: [{ id: store.branches[0].id }] }
        }
      })
    })
  }
}
