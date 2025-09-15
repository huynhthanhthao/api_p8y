import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { HttpException } from '@common/exceptions'
import { CUSTOMER_ERROR } from '@common/errors/customer.error'
import { generateTimesTamp } from '@common/helpers'

@Injectable()
export class DeleteCustomerUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, userId: string, storeCode: string): Promise<string> {
    const customer = await this.prismaClient.customer.findUnique({
      where: { id, storeCode }
    })

    if (!customer) {
      throw new HttpException(HttpStatus.NOT_FOUND, CUSTOMER_ERROR.CUSTOMER_NOT_FOUND)
    }

    await this.prismaClient.customer.update({
      where: { id, storeCode },
      data: {
        code: `del_${customer.code}_${generateTimesTamp()}`,
        phone: customer.phone ? `del_${customer.phone}_${generateTimesTamp()}` : null,
        email: customer.email ? `del_${customer.email}_${generateTimesTamp()}` : null,
        deletedBy: userId
      }
    })

    await this.prismaClient.customer.delete({
      where: {
        id,
        storeCode
      }
    })

    return id
  }
}
