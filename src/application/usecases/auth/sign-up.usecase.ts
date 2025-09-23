import * as bcrypt from 'bcrypt'
import { PrismaService } from '@infrastructure/prisma'
import { SignUpRequestDto, SignUpResponseDto } from '@interface-adapter/dtos/auth'
import { UserTypeEnum, UserStatusEnum } from '@common/enums'
import { generateStoreCode } from '@common/helpers'
import { HttpException } from '@common/exceptions'
import { HttpStatus, Injectable } from '@nestjs/common'
import { STORE_EXPIRY_DAYS } from '@common/constants/time.constants'
import { SIGNUP_ERROR } from '@common/errors'

@Injectable()
export class SignUpUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(data: SignUpRequestDto): Promise<SignUpResponseDto> {
    const storeCode = generateStoreCode(data.storeName)

    await this.validateStoreExists(storeCode)

    await this.validateUserExists(data.phone)

    await this.initializeStoreSetup(data, storeCode)

    return { storeCode }
  }

  private async validateStoreExists(storeCode: string): Promise<void> {
    const store = await this.prismaClient.store.findUnique({ where: { code: storeCode } })

    if (store) {
      throw new HttpException(HttpStatus.CONFLICT, SIGNUP_ERROR.STORE_ALREADY_EXISTS)
    }
  }

  private async validateUserExists(phone: string): Promise<void> {
    const user = await this.prismaClient.user.findFirst({
      where: { phone, type: UserTypeEnum.SUPER_ADMIN }
    })
    if (user) {
      throw new HttpException(HttpStatus.CONFLICT, SIGNUP_ERROR.PHONE_ALREADY_EXISTS)
    }
  }

  private async initializeStoreSetup(data: SignUpRequestDto, storeCode: string): Promise<void> {
    await this.prismaClient.$transaction(async tx => {
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

      /**
       * Tạo phương thức thanh toán
       */
      const paymentMethodsData = [
        {
          code: 'CASH',
          branchId: store.branches[0].id,
          isActive: true
        },
        {
          code: 'BANK_TRANSFER',
          branchId: store.branches[0].id,
          isActive: false
        }
      ]

      await tx.paymentMethod.createMany({
        data: paymentMethodsData
      })

      /**
       * Tạo user super admin
       */
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
