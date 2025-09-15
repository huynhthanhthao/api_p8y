import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { Customer } from '@common/types'

@Injectable()
@Injectable()
export class GetOneCustomerUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, storeCode: string): Promise<Customer> {
    return await this.prismaClient.customer.findUniqueOrThrow({
      where: { id, storeCode },
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      },
      include: {
        customerGroup: {
          omit: {
            deletedAt: true,
            deletedBy: true,
            createdBy: true,
            updatedBy: true
          }
        },
        customerInvoiceInfo: true
      }
    })
  }
}
