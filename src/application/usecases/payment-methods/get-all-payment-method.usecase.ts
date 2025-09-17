import { Prisma } from '@prisma/client'
import { PrismaService } from '@infrastructure/prisma'
import { Injectable } from '@nestjs/common'
import {
  GetAllPaymentMethodRequestDto,
  GetAllPaymentMethodResponseDto
} from '@interface-adapter/dtos/payment-methods'

@Injectable()
export class GetAllPaymentMethodUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: GetAllPaymentMethodRequestDto,
    branchId: string
  ): Promise<GetAllPaymentMethodResponseDto> {
    const { page, perPage, orderBy, sortBy, isActive } = data

    const where: Prisma.PaymentMethodWhereInput = {
      branchId,
      ...(isActive !== undefined &&
        isActive && {
          isActive
        })
    }

    return await this.prismaClient.findManyWithPagination(
      'paymentMethod',
      {
        where,
        orderBy: { [sortBy]: orderBy }
      },
      { page, perPage }
    )
  }
}
