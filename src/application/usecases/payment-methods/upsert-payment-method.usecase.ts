import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import {
  UpsertPaymentMethodRequestDto,
  UpsertPaymentMethodResponseDto
} from '@interface-adapter/dtos/payment-methods'
import { PRODUCT_GROUP_ERROR } from '@common/errors'

@Injectable()
export class CreatePaymentMethodUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(data: UpsertPaymentMethodRequestDto, userId: string, branchId: string) {
    // return await this.prismaClient.paymentMethod.upsert({
    //   where: {
    //     code_branchId: {
    //       code: data.code,
    //       branchId
    //     }
    //   },
    //   create: {
    //     code: data.code,
    //     isActive: data.isActive,
    //     bankAccountHolder: data.bankAccountHolder,
    //     bankBin: data.bankBin,
    //     bankShortName: data.bankShortName,
    //     bankAccount: data.bankAccount,
    //     branchId
    //   },
    //   update: {
    //     branchId
    //   }
    // })
  }
}
