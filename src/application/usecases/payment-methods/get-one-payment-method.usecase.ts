import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { PaymentMethod } from '@common/types'
import { HttpException } from '@common/exceptions'
import { PAYMENT_METHOD_ERROR } from '@common/errors/payment-method.error'

@Injectable()
export class GetOnePaymentMethodUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(code: string, branchId: string): Promise<PaymentMethod> {
    const paymentMethod = await this.prismaClient.paymentMethod.findUnique({
      where: {
        code_branchId: {
          code,
          branchId
        }
      }
    })

    if (!paymentMethod) {
      throw new HttpException(HttpStatus.NOT_FOUND, PAYMENT_METHOD_ERROR.PAYMENT_METHOD_NOT_FOUND)
    }

    return paymentMethod
  }
}
