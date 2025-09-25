import { PrismaService } from '@infrastructure/prisma'
import { Injectable } from '@nestjs/common'
import { UpsertPaymentMethodRequestDto } from '@interface-adapter/dtos/payment-methods'

@Injectable()
export class UpsertPaymentMethodUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(data: UpsertPaymentMethodRequestDto, userId: string, branchId: string) {
    return await this.prismaClient.paymentMethod.upsert({
      where: {
        code_branchId: {
          code: data.code,
          branchId
        }
      },
      create: {
        code: data.code,
        isActive: data.isActive,
        bankAccountHolder: data.bankAccountHolder,
        bankBin: data.bankBin,
        bankShortName: data.bankShortName,
        bankAccount: data.bankAccount,
        createdBy: userId,
        branchId
      },
      update: {
        code: data.code,
        isActive: data.isActive,
        bankAccountHolder: data.bankAccountHolder,
        bankBin: data.bankBin,
        bankShortName: data.bankShortName,
        bankAccount: data.bankAccount,
        updatedBy: userId
      }
    })
  }
}
